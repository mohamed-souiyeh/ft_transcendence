import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './strategy/jwt.strategy';
import { jwt_refresh_sign_options, jwt_sign_options } from './config/jwt.config';
// import { User } from 'src/users/users.service';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  getJwtAcessToken(user) {
    
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      TFAisenabled: user.TFAisenabled,
    };

    return {
      accessToken: this.jwtService.sign(payload, jwt_sign_options),
    };
  }

  getJwtRefreshToken(user) {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      TFAisenabled: user.TFAisenabled,
    };

    return {
      refreshToken: this.jwtService.sign(payload, jwt_refresh_sign_options),
    };
  }
}
