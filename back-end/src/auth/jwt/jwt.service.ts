import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  jwt_refresh_sign_options,
  jwt_sign_options,
} from './config/jwt.config';
import { UserDto } from '../../users/User_DTO/User.dto';
import { JwtPayload } from './JwtPayloadDto/JwtPayloadDto';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  async getJwtAcessToken(user: UserDto, TFAauthenticated: boolean = false) {
    
    
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      TFAisenabled: user.TFAisenabled,
      TFAauthenticated: TFAauthenticated,
    };

    const accessToken = await this.jwtService.signAsync(
      payload,
      jwt_sign_options,
    );

    return accessToken;
  }

  async getJwtRefreshToken(user: UserDto, TFAauthenticated: boolean = false) {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      TFAisenabled: user.TFAisenabled,
      TFAauthenticated: TFAauthenticated,
    };

    const refreshToken = await this.jwtService.signAsync(
      payload,
      jwt_refresh_sign_options,
    );
    return refreshToken;
  }
}
