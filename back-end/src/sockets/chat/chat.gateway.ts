/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { baseGateWayConfig } from '../baseGateWayConfig/baseGateWay.config';
import { ChatService } from './chat.service';
import { UsersService } from 'src/database/users/users.service';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { ChannelType, Role, UserState } from '@prisma/client';
import { JwtPayload } from 'src/auth/jwt/JwtPayloadDto/JwtPayloadDto';
import { Server, Socket } from 'socket.io';
import Joi from 'joi';
import { ConversationsService } from 'src/database/conversations/conversations.service';
import { Logger, UseGuards } from '@nestjs/common';
import { modiratorChatGuard } from './modiratorchat-guard/moderatorchat.guard';
import { ChannelGuard } from './channel/channel.guard';
import { DmGuard } from './dm/dm.guard';
import { GetAllMsgsGuard } from './get-all-msgs/get-all-msgs.guard';
import { ChannelBroadcastedMsg } from './types/channelBroadcastedMsg.type';
import { dmBroadcastedMsg } from './types/dmBroadcastedMsg.type';
import { LeaveChannelGuard } from './leave-channel/leave-channel.guard';
import { AddUsersGuard } from './add-users/add-users.guard';
import { ChangeChannelTypeGuard } from './change-channel-type/change-channel-type.guard';
import { ChangeChannelPasswordGuard } from './change-channel-password/change-channel-password.guard';
import { JoinChannelGuard } from './join-channel/join-channel.guard';
import { RemoveChannelGuard } from './remove-channel/remove-channel.guard';
import { eventBus } from 'src/eventBus';
import { setTimeout } from 'timers';
// import { eventBus } from 'src/eventBus';
// import { UserDto } from 'src/database/users/User_DTO/User.dto';

const chatGatewayConfig = {
  ...baseGateWayConfig,
  namespace: 'chat',
};

@WebSocketGateway(chatGatewayConfig)
export class ChatGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {

  constructor(private readonly chatService: ChatService,
    private readonly usersService: UsersService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly convService: ConversationsService) { }

  @WebSocketServer()
  private server: Server;


  afterInit(server: Server) {
    this.server = server;

    const onChannelCreated = async (channelData: any) => {
      eventBus.emit('reconnect', channelData.userId);
    }

    eventBus.on('channelCreated', onChannelCreated);

    const onDMCreated = async (dmData: any) => {
      eventBus.emit('reconnect', dmData.userId);
    }

    eventBus.on('DMCreated', onDMCreated);

    // console.log('chat gateway configured', chatGatewayConfig);
    // console.log('chat gateway initialized');
  }

  async checkIfActiveAgain(user: any) {
    for (const channel of user.channels) {
      const userState = channel.usersState.find(userState => userState.userId === user.id);
      if (userState.state === UserState.banned) {
        if (userState.until < new Date()) {
          await this.convService.updateUserState(channel.id, user.id, UserState.active);
        }
      }
      else if (userState.state === UserState.muted) {
        if (userState.until < new Date()) {
          await this.convService.updateUserState(channel.id, user.id, UserState.active);
        }
      }
    }
  }

  async addToRooms(user: any, client: Socket) {

    for (const dm of user.dms) {
      // Logger.debug(dm, "dm");
      client.join(`dm.${dm.id}`);
    }

    for (const channel of user.channels) {
      // Logger.debug(channel, "channel");
      client.join(`channel.${channel.id}`);
    }
    await this.checkIfActiveAgain(user);
  }


  async handleConnection(client: Socket) {
    const user = await this.chatService.getUserFromSocket(client);

    if (user == null)
      return;

    await this.addToRooms(user, client);
    // console.log('chat client connected');
    // console.log("user => ", user);
  }

  async handleDisconnect() {
    // console.log('client disconnected from chat');
  }



  //SECTION - Channels

  // async validateCheckChannelMsg(msg: any) {
  //   const schema = Joi.object({
  //     convType: Joi.string().required().valid(ChannelType.public, ChannelType.protected, ChannelType.private),
  //     convId: Joi.number().required(),
  //   });

  //   const { error } = schema.validate(msg);

  //   if (error) {
  //     // console.log("error => ", error);
  //     throw new WsException(error.message);
  //   }

  //   msg.convId = Number(msg.convId);
  // }

  // @UseGuards(ChannelGuard)
  // @SubscribeMessage('checkChannelpls')
  // async checkChannelpls(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {

  //   await this.validateCheckChannelMsg(msg);

  //   const { jwt } = await this.chatService.getTokensFromSocket(client);

  //   const payload: JwtPayload = await this.jwtAuthService.decodetoken(jwt);

  //   const conv = await this.convService.getChannel(msg.convId, payload.id);

  //   const userState = conv.usersState.find(userState => userState.userId === payload.id);

  //   return userState;
  // }


  async validateChannelMsg(msg: any) {
    const schema = Joi.object({
      authorUsername: Joi.string().required(),
      message: Joi.string().required().max(250).min(1),
      convType: Joi.string().required().valid(ChannelType.public, ChannelType.protected, ChannelType.private),
      convId: Joi.number().required(),
    });

    const { error } = schema.validate(msg);

    if (error) {
      // console.log("error => ", error);
      throw new WsException(error.message);
    }

    msg.convId = Number(msg.convId);
  }

  getUser = async (client: Socket) => {
    const { jwt } = await this.chatService.getTokensFromSocket(client);

    const payload = await this.jwtAuthService.decodetoken(jwt);

    const user = await this.usersService.findUserById(payload.id);

    return user;
  }

  @UseGuards(ChannelGuard)
  @SubscribeMessage('channelmsg')
  async handleMessage(@MessageBody() msg, @ConnectedSocket() client: Socket) {

    // await this.validateChannelMsg(msg);

    const { jwt } = await this.chatService.getTokensFromSocket(client);

    const payload: JwtPayload = await this.jwtAuthService.decodetoken(jwt);


    const conv = await this.convService.getChannel(msg.convId, payload.id);


    const user = conv.users.find(user => user.id === payload.id);

    const userState = conv.usersState.find(userState => userState.userId === payload.id);

    const bannedUsers = conv.usersState.filter(userState => userState.state === UserState.banned);


    const adapter = this.server.adapter as any;
    const room = adapter.rooms.get(`channel.${msg.convId}`);



    if (room && room.size > 0) {
      // const clients = [...room];
      // console.log("room", room);
      // Logger.debug(typeof room.forEach, "room.forEach");
      // Logger.debug(typeof room, "typeof room");
      // console.log("-------------------------------------------------------------------------");
      const db_msg = {
        text: msg.message,
        senderId: user.id,
        channelId: msg.convId,
      }
      const toSend = await this.convService.createMessage(db_msg);
      room.forEach(async (client) => {
        console.log("client => ", client);
        // Logger.debug(client, "client");


        const sockets = this.server.sockets as any;
        // console.log("server => ", sockets.get(client));
        const clientSocket = sockets.get(client);

        if (!clientSocket) {
          Logger.debug("clientSocket is undefined", "sending to client")
          return;
        }

        const usertToSendTo = await this.getUser(clientSocket);

        const isBlocked = await this.usersService.getBlockStatus(user.id, usertToSendTo.username);

        Logger.debug('user to send to => ', usertToSendTo.username, " id: ", usertToSendTo.id, "sending to client");
        Logger.debug(`isBlocked => ${isBlocked.isBlocked}`, "sending to client");
        Logger.debug(`isBanned => ${bannedUsers.find(userState => userState.userId === usertToSendTo.id) }`, "sending to client");
        // Logger.debug('user to send to => ', usertToSendTo, "sending to client")

        if (isBlocked.isBlocked || bannedUsers.find(userState => userState.userId === usertToSendTo.id)) {
          Logger.debug(`user ${usertToSendTo.username} is blocked or banned, not sending`, "sending to client")
          return;
        }

        Logger.debug(`sending to ${usertToSendTo.username}`, "sending to client")

        this.server.to(client).emit('broadcast', {
          id: toSend.id,
          authorInfo: {
            username: user.username,
            id: user.id,
            role: userState.role,
            usersAuthorBlockedBy: user.blockedBy,
          },
          message: msg.message,
          convType: msg.convType,
          convId: msg.convId,
          bannedUsers: bannedUsers,
        });
      })
    }
  }


  async replaceOwner(convId: number, userId: number) {
    const conv = await this.convService.getChannel(convId, userId);

    if (userId !== conv.ownerId) return;

    const newOwnerProspects = conv.usersState.filter(userState => userState.role === Role.modirator);

    // console.log("newOwnerProspects => ", newOwnerProspects);
    if (newOwnerProspects.length !== 0) {
      await this.convService.updateUserRole(convId, newOwnerProspects[0].userId, Role.owner);
      return true;
    }

    const newOwner = conv.usersState.find(userState => userState.role === Role.user);

    // console.log("newOwner => ", newOwner);
    if (newOwner === undefined) {
      await this.convService.deleteChannel(convId);
      return false;
    }

    await this.convService.updateUserRole(convId, newOwner.userId, Role.owner);
    return true;
  }

  @UseGuards(LeaveChannelGuard)
  @SubscribeMessage('leaveChannel')
  async leaveChannel(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {
    msg.convId = Number(msg.convId);

    const { jwt } = await this.chatService.getTokensFromSocket(client);

    const payload: JwtPayload = await this.jwtAuthService.decodetoken(jwt);


    if (await this.replaceOwner(msg.convId, payload.id) === false) {
      this.server.to(`channel.${msg.convId}`).emit('update', {
        message: 'the owner left and channel removed',
      });
      return { message: 'you left and channel removed' };
    }

    await this.convService.removeUserFromChannel(msg.convId, payload.id);

    this.server.to(`channel.${msg.convId}`).emit('update', {
      message: 'user left',
    });

    eventBus.emit('reconnect', payload.id);
    return { message: 'you left the channel' };
  }

  @UseGuards(modiratorChatGuard)
  @SubscribeMessage('kickUser')
  async kickUser(@MessageBody() msg: any) {
    this.convService.removeUserFromChannel(msg.convId, msg.targetedUserId);

    this.server.to(`channel.${msg.convId}`).emit('update', {
      message: 'a user kicked',
    });

    return { message: 'a user kicked' };
  }

  async checkDate(date: Date) {
    if (date === undefined)
      throw new WsException({ error: 'Unauthorized operation', message: 'you need to provide an end date for this operation' });

    const now = new Date();
    const until = new Date(date);
    if (until < now)
      throw new WsException({ error: 'Unauthorized operation', message: 'the end date for the ban is in the past' });
    return until;
  }

  @UseGuards(modiratorChatGuard)
  @SubscribeMessage('banUser')
  async banUser(@MessageBody() msg: any) {
    const until = await this.checkDate(msg.until);

    const now = new Date();

    //NOTE - only launch the timer if the time is less than 5 hours
    if (until.getTime() - now.getTime() < 5 * (1000 * 60 * 60)) {
      setTimeout(() => {
        this.convService.updateUserState(msg.convId, msg.targetedUserId, UserState.active);
        this.server.to(`channel.${msg.convId}`).emit('update', {
          message: 'a user unbanned',
        });
      }, until.getTime() - now.getTime() + (0.5 * 60000));
    }

    await this.convService.updateUserState(msg.convId, msg.targetedUserId, UserState.banned, until);

    this.server.to(`channel.${msg.convId}`).emit('update', {
      message: 'a user banned',
    });

    return { message: 'a user banned' };
  }

  @UseGuards(modiratorChatGuard)
  @SubscribeMessage('unbanUser')
  async unbanUser(@MessageBody() msg: any) {
    await this.convService.updateUserState(msg.convId, msg.targetedUserId, UserState.active);

    this.server.to(`channel.${msg.convId}`).emit('update', {
      message: 'a user unbanned',
    });

    return { message: 'a user unbanned' };
  }

  @UseGuards(modiratorChatGuard)
  @SubscribeMessage('muteUser')
  async muteUser(@MessageBody() msg: any) {
    const until = await this.checkDate(msg.until);


    const now = new Date();



    if (until.getTime() - now.getTime() < 5 * (1000 * 60 * 60)) {
      //NOTE - only launch the timer if the time is less than 5 hours
      setTimeout(() => {
        this.convService.updateUserState(msg.convId, msg.targetedUserId, UserState.active);
        this.server.to(`channel.${msg.convId}`).emit('update', {
          message: 'a user unmuted',
        });
      }, until.getTime() - now.getTime() + (0.5 * 60000));
    }


    await this.convService.updateUserState(msg.convId, msg.targetedUserId, UserState.muted, until);

    this.server.to(`channel.${msg.convId}`).emit('update', {
      message: 'a user muted',
    });

    return { message: 'a user muted' };
  }

  @UseGuards(modiratorChatGuard)
  @SubscribeMessage('unmuteUser')
  async unmuteUser(@MessageBody() msg: any) {
    await this.convService.updateUserState(msg.convId, msg.targetedUserId, UserState.active);

    this.server.to(`channel.${msg.convId}`).emit('update', {
      message: 'a user unmuted',
    });

    return { message: 'a user unmuted' };
  }


  @UseGuards(modiratorChatGuard)
  @SubscribeMessage('giveAdminRole')
  async giveAdminRole(@MessageBody() msg: any) {

    await this.convService.updateUserRole(msg.convId, msg.targetedUserId, Role.modirator);

    this.server.to(`channel.${msg.convId}`).emit('update', {
      message: 'a user is now admin',
    });
    return { message: 'a user is now admin' };
  }

  @UseGuards(modiratorChatGuard)
  @SubscribeMessage('removeAdminRole')
  async removeAdminRole(@MessageBody() msg: any) {
    await this.convService.updateUserRole(msg.convId, msg.targetedUserId, Role.user);

    this.server.to(`channel.${msg.convId}`).emit('update', {
      message: 'a user is no longer admin',
    });

    return { message: 'a user is no longer admin' };
  }



  @UseGuards(AddUsersGuard)
  @SubscribeMessage('addUser')
  async addUser(@MessageBody() msg: any) {
    msg.convId = Number(msg.convId);
    msg.targetedUserId = Number(msg.targetedUserId);

    await this.convService.addUserToChannel(msg.convId, msg.targetedUserId);

    eventBus.emit('reconnect', msg.targetedUserId);

    this.server.to(`channel.${msg.convId}`).emit('update', {
      message: 'a user added',
    });

    return { message: 'a user added' };
  }

  @UseGuards(ChangeChannelTypeGuard)
  @SubscribeMessage('changeChannelType')
  async changeChanneltype(@MessageBody() msg: any) {
    await this.convService.setChanneltype(msg.convId, msg.newType,
      msg.password === undefined ? null : msg.password);

    console.log("channel type changed");
    this.server.to(`channel.${msg.convId}`).emit('update', {
      message: 'channel type changed',
    });

    return { message: 'channel type changed' };
  }


  @UseGuards(ChangeChannelPasswordGuard)
  @SubscribeMessage('changeChannelPassword')
  async changeChannelPassword(@MessageBody() msg: any) {
    msg.convId = Number(msg.convId);

    await this.convService.setChannelPassword(msg.convId, msg.password);

    this.server.to(`channel.${msg.convId}`).emit('update', {
      message: 'password changed',
    });

    return { message: 'password changed' };
  }

  @UseGuards(JoinChannelGuard)
  @SubscribeMessage('joinChannel')
  async joinChannel(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {
    msg.convId = Number(msg.convId);

    const { jwt } = await this.chatService.getTokensFromSocket(client);

    const payload: JwtPayload = await this.jwtAuthService.decodetoken(jwt);


    await this.convService.addUserToChannel(msg.convId, payload.id);

    this.server.to(`channel.${msg.convId}`).emit('update', {
      message: 'a user joined',
    });

    return { message: 'you joined the channel' };
  }

  @UseGuards(RemoveChannelGuard)
  @SubscribeMessage('removeChannel')
  async removeChannel(@MessageBody() msg: any) {
    msg.convId = Number(msg.convId);

    await this.convService.deleteChannel(msg.convId);

    this.server.to(`channel.${msg.convId}`).emit('update', {
      message: 'channel removed',
    });

    return { message: 'channel removed' };
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
      // console.log("error => ", error);
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

    // console.log("isBlocked => ", isBlocked);

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
      // console.log("error => ", error);
      throw new WsException(error.message);
    }

    msg.convId = Number(msg.convId);
  }

  @UseGuards(DmGuard)
  @SubscribeMessage('dmmsg')
  async handleDMMessage(@MessageBody() msg, @ConnectedSocket() client: Socket) {

    // console.log("msg => ", msg);

    await this.validateDmMsg(msg);

    const { jwt } = await this.chatService.getTokensFromSocket(client);

    const payload: JwtPayload = await this.jwtAuthService.decodetoken(jwt);

    const dm = await this.convService.getDm(msg.convId);

    const user1 = dm.users.find(user => user.id === payload.id);

    const user2 = dm.users.find(user => user.id !== payload.id);

    const isBlocked = (user1.blockedUsers.find(user => user.id === user2.id) || user2.blockedUsers.find(user => user.id === user1.id)) === undefined ? false : true;

    // console.log("is first user blocked second user: ", user1.blockedUsers.find(user => user.id === user2.id));
    // console.log("is second user blocked first user: ", user2.blockedUsers.find(user => user.id === user1.id));

    // console.log("isBlocked => ", isBlocked);

    if (isBlocked)
      return { message: 'you are blocked by the other user in this conversation' };

    // console.log("adapter keys => ", Object.keys(this.server.adapter));
    // console.log("adapter values => ", Object.values(this.server.adapter));
    // return ;

    const adapter = this.server.adapter as any;
    const room = adapter.rooms.get(`dm.${msg.convId}`);

    // console.log("room => ", room);


    if (room && room.size > 0) {
      // console.log("we are sending the msge to : ", `dm.${msg.convId}`)
      const db_msg = {
        text: msg.message,
        senderId: user1.id,
        dmId: msg.convId,
      }
      const toSend = await this.convService.createMessage(db_msg);
      this.server.to(`dm.${msg.convId}`).emit('broadcast', {
        id: toSend.id,
        authorInfo: {
          username: user1.username,
          authorId: user1.id
        },
        message: msg.message,
        convType: msg.convType,
        convId: msg.convId,
      });
    }
    return { message: 'message sent' };
  }
  //!SECTION - DMs



  //SECTION - getAllMessages

  @UseGuards(GetAllMsgsGuard)
  @SubscribeMessage('getAllMessages')
  async getAllMessages(@MessageBody() msg: any, @ConnectedSocket() client: Socket) {
    if (msg.convType === ChannelType.dm) {
      const conv = await this.convService.getDmMessages(msg.convId);

      const messages: Array<dmBroadcastedMsg> = new Array<dmBroadcastedMsg>();

      for (const msg of conv.messages) {
        // eslint-disable-next-line prefer-const
        let toAdd: dmBroadcastedMsg = new dmBroadcastedMsg();

        toAdd.id = msg.id;
        toAdd.authorInfo.autorId = msg.sender.id;
        toAdd.authorInfo.username = msg.sender.username;

        toAdd.message = msg.text;
        toAdd.convType = conv.type;
        toAdd.convId = conv.id;

        messages.push(toAdd);
      }

      return messages;
    } else if (msg.convType in ChannelType) {
      const conv = await this.convService.getChannelMessages(msg.convId);
      const messages: Array<ChannelBroadcastedMsg> = new Array<ChannelBroadcastedMsg>();
      for (const msg of conv.messages) {
        // eslint-disable-next-line prefer-const
        let toAdd: ChannelBroadcastedMsg = new ChannelBroadcastedMsg();

        toAdd.id = msg.id;
        toAdd.authorInfo.username = msg.sender.username;
        toAdd.authorInfo.id = msg.sender.id;

        const userstate = conv.usersState.find(userState => userState.userId === msg.sender.id);
        toAdd.authorInfo.role = userstate ? userstate.role : "kicked" as Role;
        toAdd.authorInfo.usersAuthorBlockedBy = msg.sender.blockedBy.map(user => ({
          id: user.id,
          username: user.username,
        }));

        toAdd.message = msg.text;
        toAdd.convType = conv.type;
        toAdd.convId = conv.id;
        toAdd.bannedUsers = conv.usersState.filter(userState => userState.state === UserState.banned);

        const user = await this.getUser(client);
        const isBlocked = await this.usersService.getBlockStatus(toAdd.authorInfo.id, user.username);

        if (isBlocked.isBlocked === false)
          messages.push(toAdd);
      }
      // console.log("messages => ", messages);
      return messages;
    } else {
      throw new WsException({ error: 'Unauthorized operation', message: 'channel type doenst exist' });
    }
  }

  //!SECTION - getAllMessages
}
