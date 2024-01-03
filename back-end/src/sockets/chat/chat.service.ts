import { Injectable, UnauthorizedException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ChatService {
  constructor(private readonly authService: AuthService) {}


  async getTokensFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;

    const { jwt, refreshJwt } = parse(cookie);

    return { jwt, refreshJwt };
  }

  /**
   * 
   * @param socket the client socket
   * @param checkAuthStatus whether to check if the user is authenticated or not
   * @returns the user object if the user is authenticated and throws an exception if not
   */
  async getUserFromSocket(socket: Socket) {

    const { jwt, refreshJwt } = await this.getTokensFromSocket(socket);

    if (jwt == null || refreshJwt == null) {
      console.log('jwt or refreshJwt is null');
      socket.emit('401', 'Unauthorized access');
      socket.disconnect();
      return null;
      // throw new WsException('Unauthorized access');
    }
    
    const user = await this.authService.getUserFromAuthenticationToken(jwt, refreshJwt);
    if (user == null) {
      console.log('user is null');
      socket.emit('401', 'Unauthorized access');
      socket.disconnect();
      // throw new WsException('Unauthorized access');
    }
    return user;
  }
}
