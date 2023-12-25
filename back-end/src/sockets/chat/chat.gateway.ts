import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { baseGateWayConfig } from '../baseGateWayConfig/baseGateWay.config';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UsersService } from 'src/database/users/users.service';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { UserStatus } from '@prisma/client';
import { JwtPayload } from 'src/auth/jwt/JwtPayloadDto/JwtPayloadDto';

const chatGatewayConfig = {
  ...baseGateWayConfig,
  namespace: 'chat',
};

@WebSocketGateway(chatGatewayConfig)
export class ChatGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {

  constructor(private readonly chatService: ChatService, private readonly usersService: UsersService, private readonly jwtAuthService: JwtAuthService) {}

  @WebSocketServer()
  server: Server;

  dms: Map<string, string> = new Map();// <`${convType}.${convId}`, roomIdentifier>
  channels: Map<string, string> = new Map();// <`${convType}.${convId}`, roomIdentifier>

  async afterInit(server: Server) {
    // this.server = server;
    console.log('chat gateway initialized');
  }
  
  async handleConnection(client: Socket) {
    try {
      const user = await this.chatService.getUserFromSocket(client);
      await this.usersService.setStatus(user.id, UserStatus.online);

      
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

    console.log("payload => ", payload);
    console.log('client disconnected');
  }





  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() msg, @ConnectedSocket() client: Socket){
    //NOTE - this function will get us the user and authenticate him 
    // const author = await this.chatService.getUserFromSocket(client);


    // this.server.sockets.emit('receiveMessage', {
    //   author,
    //   message: msg,
    // }); 
    console.log(this.server.sockets.emit);
    this.server.emit('receiveMessage', {
      message: msg.message,
      author: msg.author,
    });
    return {msg : "message sent"};
  }
}
