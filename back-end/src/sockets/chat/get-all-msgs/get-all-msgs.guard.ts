/* eslint-disable @typescript-eslint/no-explicit-any */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { ConversationsService } from 'src/database/conversations/conversations.service';
import Joi from 'joi';
import { WsException } from '@nestjs/websockets';
import { ChannelType, UserState } from '@prisma/client';



@Injectable()
export class GetAllMsgsGuard implements CanActivate {

  constructor(private readonly chatService: ChatService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly convService: ConversationsService) { }


  async validateChannelMsg(msg: any) {
    const schema = Joi.object({
      convType: Joi.string().required().valid(ChannelType.dm, ChannelType.public, ChannelType.protected, ChannelType.private),
      convId: Joi.number().required(),
    });

    const { error } = schema.validate(msg);

    if (error) {
      // console.log("error => ", error);
      throw new WsException(error.message);
    }

    msg.convId = Number(msg.convId);
  }


  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const client = await context.switchToWs().getClient();

    const data = await context.switchToWs().getData();

    await this.validateChannelMsg(data);

    const { jwt } = await this.chatService.getTokensFromSocket(client);

    const payload = await this.jwtAuthService.decodetoken(jwt);

    
    if (data.convType === ChannelType.dm) {
      const conv = await this.convService.getDm(data.convId);
  
      if (conv === null)
        throw new WsException({ error: 'Unauthorized operation', message: 'channel doenst exist' });

      const user = conv.users.find(user => user.id === payload.id);

      if (user === undefined)
        throw new WsException({ error: 'Unauthorized operation', message: 'you are not in this dm' });

      const user2 = conv.users.find(user => user.id !== payload.id);

      const isBlocked = (user.blockedUsers.find(user => user.id === user2.id) || user2.blockedUsers.find(user => user.id === user.id)) === undefined ? false : true;

      if (isBlocked)
        throw new WsException({ error: 'Unauthorized operation', message: 'you are blocked by the other user in this conversation' });

    } else if (data.convType in ChannelType) {
      const conv = await this.convService.getChannel(data.convId, payload.id);

      if (conv === null)
        throw new WsException({ error: 'Unauthorized operation', message: 'channel doenst exist' });

      const userState = conv.usersState.find(userState => userState.userId === payload.id);

      if (userState === undefined)
        throw new WsException({ error: 'Unauthorized operation', message: 'you are not in this channel' });

      if (userState.state === UserState.banned)
        throw new WsException({ error: 'Unauthorized operation', message: 'you are banned from this channel' });

    } else {
      throw new WsException({ error: 'Unauthorized operation', message: 'channel type is not valid: some kinky fuckery happened' });
    }
    return true;
  }
}
