import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ChatService {
  constructor(private readonly authService: AuthService) {}

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;

    const { jwt, refreshJwt } = parse(cookie);
    const user = await this.authService.getUserFromAuthenticationToken(jwt, refreshJwt);
    if (user == null) {
      throw new WsException('Unauthorized access');
    }
    return user;
  }
}
