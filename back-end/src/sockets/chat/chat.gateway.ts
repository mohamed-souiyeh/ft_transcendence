import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { baseGateWayConfig } from '../baseGateWayConfig/baseGateWay.config';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

const chatGatewayConfig = {
  ...baseGateWayConfig,
  namespace: 'chat',
};

@WebSocketGateway(chatGatewayConfig)
export class ChatGateway implements OnGatewayConnection {

  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    await this.chatService.getUserFromSocket(client);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() msg, @ConnectedSocket() client: Socket){
    //NOTE - this function will get us the user and authenticate him 
    const author = await this.chatService.getUserFromSocket(client);


    this.server.sockets.emit('receiveMessage', {
      author,
      message: msg,
    });
  }
}
