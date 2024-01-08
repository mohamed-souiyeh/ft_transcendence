import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { baseGateWayConfig } from '../baseGateWayConfig/baseGateWay.config';
import { Socket } from 'socket.io';
import { ChatService } from '../chat/chat.service';
import { UsersService } from 'src/database/users/users.service';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { scheduledLogoutMap } from '../sockets.vars';
import { UserStatus } from '@prisma/client';
import { JwtPayload } from 'src/auth/jwt/JwtPayloadDto/JwtPayloadDto';

const LOGOUT_TIMEOUT = 0.1 * 60 * 1000;

@WebSocketGateway(baseGateWayConfig)
export class MainNameSpaceGateway implements OnGatewayConnection, OnGatewayDisconnect {


  constructor(private readonly chatService: ChatService,
    private readonly usersService: UsersService,
    private readonly jwtAuthService: JwtAuthService) { }


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
