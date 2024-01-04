import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  jwt_refresh_sign_options,
  jwt_sign_options,
} from './config/jwt.config';
import { UserDto } from '../../database/users/User_DTO/User.dto';
import { JwtPayload } from './JwtPayloadDto/JwtPayloadDto';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) { }


  async decodetoken(token: string) {
    const payload = jwtDecode<JwtPayload>(token);

    return payload;
  }

  async getJwtAcessToken(user: UserDto, TFAauthenticated: boolean = false) {


    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      TFAisEnabled: user.TFAisEnabled,
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
      TFAisEnabled: user.TFAisEnabled,
      TFAauthenticated: TFAauthenticated,
    };

    const refreshToken = await this.jwtService.signAsync(
      payload,
      jwt_refresh_sign_options,
    );
    return refreshToken;
  }

  async verifyJwtAccessToken(accessToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_SECRET,
      });
      return payload;
    } catch (error) {
      // console.log("this error is in verifyJwtAccessToken => ", error);
      return null;
    }
  }
}
