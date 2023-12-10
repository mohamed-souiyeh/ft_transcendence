import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './strategy/jwt.strategy';
import {
  jwt_refresh_sign_options,
  jwt_sign_options,
} from './config/jwt.config';
import { UserDto } from '../../users/User_DTO/User.dto';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  async getJwtAcessToken(user: UserDto) {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      TFAisenabled: user.TFAisenabled,
    };

    const accessToken = await this.jwtService.signAsync(
      payload,
      jwt_sign_options,
    );

    return accessToken;
  }

  async getJwtRefreshToken(user: UserDto) {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      TFAisenabled: user.TFAisenabled,
    };

    const refreshToken = await this.jwtService.signAsync(
      payload,
      jwt_refresh_sign_options,
    );
    return refreshToken;
  }
}
