/* eslint-disable @typescript-eslint/no-explicit-any */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { ConversationsService } from 'src/database/conversations/conversations.service';
import Joi from 'joi';
import { WsException } from '@nestjs/websockets';
import { ChannelType, UserState } from '@prisma/client';


@Injectable()
export class ChannelGuard implements CanActivate {

  constructor(private readonly chatService: ChatService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly convService: ConversationsService) { }

  async validateChannelMsg(msg: any) {
    const schema = Joi.object({
      authorUsername: Joi.string().required(),
      message: Joi.string().required().max(250).min(1),
      convType: Joi.string().required().valid(ChannelType.private, ChannelType.protected, ChannelType.public),
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

    const conv = await this.convService.getChannel(data.convId, payload.id);

    if (conv === null)
      throw new WsException({ error: 'Unauthorized operation', message: 'channel doenst exist' });
  
    const userState = conv.usersState.find(userState => userState.userId === payload.id);

    if (userState === undefined)
      throw new WsException({ error: 'Unauthorized operation', message: 'you are not in this channel' });

    const isBanned = userState.state === UserState.banned;
    const isMuted = userState.state === UserState.muted;

    if (isBanned || isMuted)
      throw new WsException({ error: 'Unauthorized operation', message: 'you are banned from this channel' });

    return true;
  }
}
