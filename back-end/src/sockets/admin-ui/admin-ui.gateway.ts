import { OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { baseGateWayConfig } from '../baseGateWayConfig/baseGateWay.config';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';

@WebSocketGateway(baseGateWayConfig)
export class AdminUiGateway implements OnGatewayInit {

  @WebSocketServer()
  private server: Server;


  afterInit(server: Server) {
    this.server = server;

    instrument(this.server, {
      auth: false,
      mode: "development",
    });
    console.log('admin gateway initialized');
  }

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }
}
