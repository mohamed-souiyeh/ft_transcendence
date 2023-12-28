/* eslint-disable @typescript-eslint/no-explicit-any */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { ConversationsService } from 'src/database/conversations/conversations.service';
import Joi from 'joi';
import { ChannelType } from '@prisma/client';
import { WsException } from '@nestjs/websockets';
import { UsersService } from 'src/database/users/users.service';

@Injectable()
export class AddUsersGuard implements CanActivate {
  
  constructor(private readonly chatService: ChatService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly convService: ConversationsService,
    private readonly usersService: UsersService) { }


  async validaGuardData(data: any) {
    const schema = Joi.object({
      convType: Joi.string().required().valid(ChannelType.private, ChannelType.protected, ChannelType.public),
      convId: Joi.number().required(),
      targetedUserId: Joi.number().required(),
    });

    const { error } = schema.validate(data);

    if (error) {
      throw new WsException(error.message);
    }

    data.convId = Number(data.convId);
    data.targetedUserId = Number(data.targetedUserId);
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
      throw new WsException({error: 'Unauthorized operation'
      , message: 'the channel doesnt exist'});

    const userState = conv.usersState.find(userState => userState.userId === payload.id);

    if (userState === undefined)
      throw new WsException({error: 'Unauthorized operation'
      , message: 'you are not in the channel'});
    
    if (userState.role === 'user')
      throw new WsException({error: 'Unauthorized operation'
      , message: 'you are not allowed to add users to the channel'});
    
    const targetedUserState = conv.usersState.find(userState => userState.userId === data.targetedUserId);

    if (targetedUserState !== undefined)
      throw new WsException({error: 'Unauthorized operation'
      , message: 'the targeted user is already in the channel'});

    const userFriends = await this.usersService.getUserFriends(payload.id);

    const isFriend = userFriends.friends.find(friend => friend.id === data.targetedUserId);

    if (isFriend === undefined)
      throw new WsException({error: 'Unauthorized operation'
      , message: 'the targeted user is not your friend'});
    
    return true;
  }
}
