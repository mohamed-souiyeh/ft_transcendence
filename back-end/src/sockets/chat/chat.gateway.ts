/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { baseGateWayConfig } from '../baseGateWayConfig/baseGateWay.config';
import { ChatService } from './chat.service';
import { UsersService } from 'src/database/users/users.service';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { ChannelType, UserState, UserStatus } from '@prisma/client';
import { JwtPayload } from 'src/auth/jwt/JwtPayloadDto/JwtPayloadDto';
import { Server, Socket } from 'socket.io';
import Joi from 'joi';
import { ConversationsService } from 'src/database/conversations/conversations.service';
import { UseGuards } from '@nestjs/common';
import { modiratorChatGuard } from './chat-guard/moderatorchat.guard';
import { channel } from 'diagnostics_channel';
import { ChannelGuard } from './channel/channel.guard';
import { DmGuard } from './dm/dm.guard';
import { GetAllMsgsGuard } from './get-all-msgs/get-all-msgs.guard';
import { ChannelBroadcastedMsg } from './types/channelBroadcastedMsg.type';
import { dmBroadcastedMsg } from './types/dmBroadcastedMsg.type';

const chatGatewayConfig = {
  ...baseGateWayConfig,
  namespace: 'chat',
};

@WebSocketGateway(chatGatewayConfig)
export class ChatGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {

  constructor(private readonly chatService: ChatService, private readonly usersService: UsersService, private readonly jwtAuthService: JwtAuthService,
    private readonly convService: ConversationsService) { }

  @WebSocketServer()
  private server: Server;


  afterInit(server: Server) {
    this.server = server;
    console.log('chat gateway initialized');
  }


  async addToRooms(user: any, client: Socket) {

    for (const dm of user.dms) {
      // console.log("dm => ", dm);
      client.join(`${dm.type}.${dm.id}`);
    }

    for (const channel of user.channels) {
      // console.log("channel => ", channel);
      client.join(`${channel.type}.${channel.id}`);
    }
  }


  async handleConnection(client: Socket) {
    try {
      const user = await this.chatService.getUserFromSocket(client);
      await this.usersService.setStatus(user.id, UserStatus.online);

      await this.addToRooms(user, client);
      console.log('client connected');
      console.log("user => ", user);

    } catch (error) {
      console.log("error in chat gatway connect => ", error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const { jwt } = await this.chatService.getTokensFromSocket(client);

    const payload: JwtPayload = await this.jwtAuthService.decodetoken(jwt);
    await this.usersService.setStatus(payload.id, UserStatus.offline);

    // console.log("payload => ", payload);
    console.log('client disconnected');
  }



  //SECTION - Channels

  async validateCheckChannelMsg(msg: any) {
    const schema = Joi.object({
      convType: Joi.string().required().valid(ChannelType.public, ChannelType.protected, ChannelType.private),
      convId: Joi.number().required(),
    });

    const { error } = schema.validate(msg);

    if (error) {
      console.log("error => ", error);
      throw new WsException(error.message);
    }

    msg.convId = Number(msg.convId);
  }

  @UseGuards(ChannelGuard)
  @SubscribeMessage('checkChannelpls')
  async checkChannelpls(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {

    await this.validateCheckChannelMsg(msg);

    const { jwt } = await this.chatService.getTokensFromSocket(client);

    const payload: JwtPayload = await this.jwtAuthService.decodetoken(jwt);

    const conv = await this.convService.getChannel(msg.convId, payload.id);

    const userState = conv.usersState.find(userState => userState.userId === payload.id);

    return userState;
  }


  async validateChannelMsg(msg: any) {
    const schema = Joi.object({
      authorUsername: Joi.string().required(),
      message: Joi.string().required().max(250).min(1),
      convType: Joi.string().required().valid(ChannelType.public, ChannelType.protected, ChannelType.private),
      convId: Joi.number().required(),
    });

    const { error } = schema.validate(msg);

    if (error) {
      console.log("error => ", error);
      throw new WsException(error.message);
    }

    msg.convId = Number(msg.convId);
  }


  @UseGuards(ChannelGuard)
  @SubscribeMessage('channelmsg')
  async handleMessage(@MessageBody() msg, @ConnectedSocket() client: Socket) {

    await this.validateChannelMsg(msg);

    const { jwt } = await this.chatService.getTokensFromSocket(client);

    const payload: JwtPayload = await this.jwtAuthService.decodetoken(jwt);


    const conv = await this.convService.getChannel(msg.convId, payload.id);


    const user = conv.users.find(user => user.id === payload.id);

    const userState = conv.usersState.find(userState => userState.userId === payload.id);

    const bannedUsers = conv.usersState.filter(userState => userState.state === UserState.banned);

    this.server.to(`${msg.convType}.${msg.convId}`).emit('broadcast', {
      authorInfo: {
        authorUsername: user.username,
        authorid: user.id,
        authorRole: userState.role,
        usersAuthorBlockedBy: user.blockedBy,
      },
      message: msg.message,
      convType: msg.convType,
      convId: msg.convId,
      bannedUsers: bannedUsers,
    });

    const adapter = this.server.adapter as any;
    const room = adapter.rooms.get(`${msg.convType}.${msg.convId}`);

    if (room && room.size > 0) {
      const db_msg = {
        text: msg.message,
        senderId: user.id,
        channelId: msg.convId,
      }
      await this.convService.createMessage(db_msg);
    }
  }

  @UseGuards(modiratorChatGuard)
  @SubscribeMessage('kickUser')
  async kickUser(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {
    return "kickUser";
  }

  @SubscribeMessage('banUser')
  async banUser(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {

  }

  @SubscribeMessage('unbanUser')
  async unbanUser(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {

  }

  @SubscribeMessage('muteUser')
  async muteUser(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {

  }

  @SubscribeMessage('unmuteUser')
  async unmuteUser(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {

  }

  @SubscribeMessage('giveAdminRole')
  async giveAdminRole(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {

  }

  @SubscribeMessage('removeAdminRole')
  async removeAdminRole(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {

  }

  @SubscribeMessage('leaveChannel')
  async leaveChannel(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {

  }
  
  
  @SubscribeMessage('addUsers')
  async addUser(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {

  }




  //!SECTION - Channels









  //SECTION - DMs
  async validateCheckDmMsg(msg: any) {
    const schema = Joi.object({
      convType: Joi.string().required().valid(ChannelType.dm),
      convId: Joi.number().required(),
    });

    const { error } = schema.validate(msg);

    if (error) {
      console.log("error => ", error);
      throw new WsException(error.message);
    }

    msg.convId = Number(msg.convId);
  }

  @UseGuards(DmGuard)
  @SubscribeMessage('checkDmpls')
  async checkDmpls(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {

    await this.validateCheckDmMsg(msg);

    const { jwt } = await this.chatService.getTokensFromSocket(client);

    const payload: JwtPayload = await this.jwtAuthService.decodetoken(jwt);

    const conv = await this.convService.getDm(msg.convId);

    const User1 = conv.users.find(user => user.id === payload.id);

    const User2 = conv.users.find(user => user.id !== payload.id);

    const isBlocked = (User1.blockedUsers.find(user => user.id === User2.id) || User2.blockedUsers.find(user => user.id === User1.id)) === undefined ? false : true;

    console.log("isBlocked => ", isBlocked);

    return { isBlocked: isBlocked };
  }

  async validateDmMsg(msg: any) {
    const schema = Joi.object({
      authorUsername: Joi.string().required(),
      message: Joi.string().required().min(1).max(250),
      convType: Joi.string().required().valid(ChannelType.dm),
      convId: Joi.number().required(),
    });

    const { error } = schema.validate(msg);

    if (error) {
      console.log("error => ", error);
      throw new WsException(error.message);
    }

    msg.convId = Number(msg.convId);
  }

  @UseGuards(DmGuard)
  @SubscribeMessage('dmmsg')
  async handleDMMessage(@MessageBody() msg, @ConnectedSocket() client: Socket) {

    await this.validateDmMsg(msg);

    const { jwt } = await this.chatService.getTokensFromSocket(client);

    const payload: JwtPayload = await this.jwtAuthService.decodetoken(jwt);

    const dm = await this.convService.getDm(msg.convId);

    const user = dm.users.find(user => user.id === payload.id);


    this.server.to(`${msg.convType}.${msg.convId}`).emit('broadcast', {
      authorInfo: {
        authorUsername: user.username,
        authorId: user.id
      },
      message: msg.message,
      convType: msg.convType,
      convId: msg.convId,
    });
    // console.log("adapter keys => ", Object.keys(this.server.adapter));
    // console.log("adapter values => ", Object.values(this.server.adapter));
    // return ;

    const adapter = this.server.adapter as any;
    const room = adapter.rooms.get(`${msg.convType}.${msg.convId}`);

    if (room && room.size > 0) {
      const db_msg = {
        text: msg.message,
        senderId: user.id,
        dmId: msg.convId,
      }
      await this.convService.createMessage(db_msg);
    }
  }
  //!SECTION - DMs



  //SECTION - getAllMessages

  @UseGuards(GetAllMsgsGuard)
  @SubscribeMessage('getAllMessages')
  async getAllMessages(@MessageBody() msg: any) {
    if (msg.convType === ChannelType.dm) {
      const conv = await this.convService.getDmMessages(msg.convId);

      const messages: Array<dmBroadcastedMsg> = new Array<dmBroadcastedMsg>();

      for (const msg of conv.messages) {
        // eslint-disable-next-line prefer-const
        let toAdd: dmBroadcastedMsg = new dmBroadcastedMsg();

        toAdd.userInfo.autorId = msg.sender.id;
        toAdd.userInfo.username = msg.sender.username;

        toAdd.message = msg.text;
        toAdd.convType = conv.type;
        toAdd.convId = conv.id;

        messages.push(toAdd);
      }

      return messages;
    }else if (msg.convType in ChannelType) {
      const conv = await this.convService.getChannelMessages(msg.convId);
      const messages: Array<ChannelBroadcastedMsg> = new Array<ChannelBroadcastedMsg>();
      for (const msg of conv.messages) {
        // eslint-disable-next-line prefer-const
        let toAdd: ChannelBroadcastedMsg = new ChannelBroadcastedMsg();

        toAdd.authorInfo.authorUsername = msg.sender.username;
        toAdd.authorInfo.authorid = msg.sender.id;
        toAdd.authorInfo.authorRole = conv.usersState.find(userState => userState.userId === msg.sender.id).role;
        toAdd.authorInfo.usersAuthorBlockedBy = msg.sender.blockedBy.map(user => ({
          id: user.id,
          username: user.username,
        }));

        toAdd.message = msg.text;
        toAdd.convType = conv.type;
        toAdd.convId = conv.id;
        toAdd.bannedUsers = conv.usersState.filter(userState => userState.state === UserState.banned);

        messages.push(toAdd);
      }
      return messages;
    } else {
      throw new WsException({ error: 'Unauthorized operation', message: 'channel doenst exist' });
    }
  }

  //!SECTION - getAllMessages
}
