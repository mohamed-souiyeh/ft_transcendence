/* eslint-disable @typescript-eslint/no-explicit-any */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { ConversationsService } from 'src/database/conversations/conversations.service';
import Joi from 'joi';
import { ChannelType } from '@prisma/client';
import { WsException } from '@nestjs/websockets';
import bcrypt from 'bcrypt';


@Injectable()
export class JoinChannelGuard implements CanActivate {

  constructor(private readonly chatService: ChatService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly convService: ConversationsService) { }


  async validaGuardData(data: any) {
    const schema = Joi.object({
      convType: Joi.string().required().valid(ChannelType.protected, ChannelType.public),
      convId: Joi.number().required(),
      password: Joi.string().optional(),
    });

    const { error } = schema.validate(data);

    if (error) {
      throw new WsException(error.message);
    }

    data.convId = Number(data.convId);
  }




  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{

    const client = await context.switchToWs().getClient();

    const data = await context.switchToWs().getData();

    await this.validaGuardData(data);

    const { jwt } = await this.chatService.getTokensFromSocket(client);

    const payload = await this.jwtAuthService.decodetoken(jwt);

    const conv = await this.convService.getChannel(data.convId, payload.id);

    if (conv === null)
      throw new WsException({
        error: 'Unauthorized operation'
        , message: 'the channel doesnt exist'
      });

    if (conv.type === ChannelType.private)
      throw new WsException({
        error: 'Unauthorized operation'
        , message: 'the channel is private'
      });
    
    if (conv.type === ChannelType.protected && data.password === undefined)
      throw new WsException({
        error: 'Unauthorized operation'
        , message: 'the channel is protected you need to provide the password'
      });
    
    if (data.password && await bcrypt.compare(data.password, conv.channelPassword) === false)
      throw new WsException({
        error: 'Unauthorized operation'
        , message: 'the password is incorrect'
      });

    return true;
  }
}
