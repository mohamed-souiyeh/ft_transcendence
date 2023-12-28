/* eslint-disable @typescript-eslint/no-explicit-any */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { ConversationsService } from 'src/database/conversations/conversations.service';
import Joi from 'joi';
import { ChannelType, Role } from '@prisma/client';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChangeChannelPasswordGuard implements CanActivate {


  constructor(private readonly chatService: ChatService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly convService: ConversationsService) { }


  async validaGuardData(data: any) {
    const schema = Joi.object({
      convType: Joi.string().required().valid(ChannelType.protected),
      convId: Joi.number().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(data);

    if (error) {
      throw new WsException(error.message);
    }

    data.convId = Number(data.convId);
  }




  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const client = await context.switchToWs().getClient();

    const data = await context.switchToWs().getData();

    await this.validaGuardData(data)

    const { jwt } = await this.chatService.getTokensFromSocket(client);

    const payload = await this.jwtAuthService.decodetoken(jwt);

    const conv = await this.convService.getChannel(data.convId, payload.id);

    if (conv === null)
      throw new WsException({
        error: 'Unauthorized operation'
        , message: 'the channel doesnt exist'
      });

    const userState = conv.usersState.find(userState => userState.userId === payload.id);

    if (userState === undefined || userState.role !== Role.owner)
      throw new WsException({
        error: 'Unauthorized operation'
        , message: 'you are not the owner of the channel'
      });
    
if (conv.type !== ChannelType.protected)
      throw new WsException({
        error: 'Unauthorized operation'
        , message: 'u cant change the password of a channel that is not protected'
      });
    
    if (data.password === undefined || data.password === null || data.password === '')
      throw new WsException({
        error: 'Unauthorized operation'
        , message: 'u need to provide a password'
      });
    return true;
  }
}
