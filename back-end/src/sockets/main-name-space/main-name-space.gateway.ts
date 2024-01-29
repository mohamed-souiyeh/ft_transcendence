import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { baseGateWayConfig } from '../baseGateWayConfig/baseGateWay.config';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat/chat.service';
import { UsersService } from 'src/database/users/users.service';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { scheduledLogoutMap } from '../sockets.vars';
import { UserStatus } from '@prisma/client';
import { JwtPayload } from 'src/auth/jwt/JwtPayloadDto/JwtPayloadDto';
import { eventBus } from 'src/eventBus';
import { UserDto } from 'src/database/users/User_DTO/User.dto';

const LOGOUT_TIMEOUT = 0.1 * 60 * 1000;

@WebSocketGateway(baseGateWayConfig)
export class MainNameSpaceGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {


  constructor(private readonly chatService: ChatService,
    private readonly usersService: UsersService,
    private readonly jwtAuthService: JwtAuthService) { }


  @WebSocketServer()
  private server: Server;

  afterInit(server: Server) {
    this.server = server;

    const sendNotification = async (id: number, user: UserDto) => {
      // console.log("id in sendNotification => ", id);
      server.to(`${id}`).emit('notification', {
        message: 'you have a new notification',
        from: user
      });
    }

    eventBus.on('newNotification', sendNotification);

    eventBus.on('privateGame', async (senderID: number, guestID: number, roomID: number) =>
    {
      const user = await this.usersService.findUserById(senderID);
      console.log("user in private game => ", user);
      server.to(`${guestID}`).emit('private',
        roomID, user.username);
    });

    eventBus.on('reconnect', async (id: number) => {
      server.to(`${id}`).emit('reconnect');
    });
  }

  async handleConnection(client: Socket) {
    const user = await this.chatService.getUserFromSocket(client);

    if (user === null)
      return;

    if (await this.usersService.getStatus(user.id) === UserStatus.offline)
      await this.usersService.setOnlineStatus(user.id);

    if (scheduledLogoutMap.has(user.id)) {
      clearTimeout(scheduledLogoutMap.get(user.id));
      scheduledLogoutMap.delete(user.id);
    }

    client.join(`${user.id}`);
    // console.log("client is online now");
  }

  async handleDisconnect(client: Socket) {
    const { jwt } = await this.chatService.getTokensFromSocket(client);

    // console.log("jwt is in the main gatway disconnect", jwt);
    if (jwt === null)
      return;

    const payload: JwtPayload = await this.jwtAuthService.decodetoken(jwt);

    scheduledLogoutMap.set(payload.id, setTimeout(() => {
      
      this.usersService.setOfflineStatus(payload.id)
      .then(() => {
        // console.log("client is offline now")
      })
      .catch(err => {
        // console.log("error happened in handel disconnect of the main gateway in set offline" ,err);
      });
    }, LOGOUT_TIMEOUT));

    // console.log("client is going to be offline in 5 minutes");
  }

  @SubscribeMessage('ping')
  async ping(client: Socket) {
    const { jwt } = await this.chatService.getTokensFromSocket(client);

    const payload: JwtPayload = await this.jwtAuthService.decodetoken(jwt);

    if (scheduledLogoutMap.has(payload.id)) {
      clearTimeout(scheduledLogoutMap.get(payload.id));
      scheduledLogoutMap.delete(payload.id);
    }
  }

}
