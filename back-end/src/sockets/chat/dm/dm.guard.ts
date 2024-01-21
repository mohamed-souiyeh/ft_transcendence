/* eslint-disable @typescript-eslint/no-explicit-any */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { ConversationsService } from 'src/database/conversations/conversations.service';
import Joi from 'joi';
import { WsException } from '@nestjs/websockets';
import { ChannelType } from '@prisma/client';

@Injectable()
export class DmGuard implements CanActivate {

  constructor(private readonly chatService: ChatService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly convService: ConversationsService) { }

  // async validateDmMsg(msg: any) {
  //   const schema = Joi.object({
  //     authorUsername: Joi.string().required(),
  //     message: Joi.string().required().min(1).max(250),
  //     convType: Joi.string().required().valid(ChannelType.dm),
  //     convId: Joi.number().required(),
  //   });

  //   const { error } = schema.validate(msg);

  //   if (error) {
  //     // console.log("error => ", error);
  //     throw new WsException(error.message);
  //   }

  //   msg.convId = Number(msg.convId);
  // }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const client = await context.switchToWs().getClient();

    const data = await context.switchToWs().getData();

    const { jwt } = await this.chatService.getTokensFromSocket(client);

    const payload = await this.jwtAuthService.decodetoken(jwt);

    
    const conv = await this.convService.getDm(data.convId);

    if (conv === null)
      throw new WsException({ error: 'Unauthorized operation', message: 'dm doenst exist' });

    const user1 = conv.users.find(user => user.id === payload.id);


    if (user1 === undefined)
      throw new WsException({ error: 'Unauthorized operation', message: 'you are not in this dm' });
    
    // const isBlocked = (user1.blockedUsers.find(user => user.id === user2.id) || user2.blockedUsers.find(user => user.id === user1.id)) === undefined ? false : true;

    // if (isBlocked)
    //   throw new WsException({ error: 'Unauthorized operation', message: 'you are blocked by the other user in this conversation' });

    return true;
  }
}
