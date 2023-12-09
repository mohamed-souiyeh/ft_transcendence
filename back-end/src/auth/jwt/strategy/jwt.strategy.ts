/* eslint-disable @typescript-eslint/no-explicit-any */
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { config } from 'dotenv';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { UserDto } from 'src/auth/User_DTO/User.dto';

config({
  encoding: 'latin1',
  debug: false,
  override: false,
});

export type JwtPayload = {
  id: number;
  email: string;
  TFAisenabled: boolean;
  TFAauthenticated?: boolean;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'myJwt') {
  constructor(private userService: UsersService) {
    const extractJwtFromCookie = (req) => {
      let token = null;

      if (req && req.cookies) {
        token = req.cookies[process.env.ACCESS_TOKEN_KEY];
      }
      return token;
    };

    super({
      jwtFromRequest: extractJwtFromCookie,
      secretOrKey: process.env['JWT_SECRET'],
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshTokenIsValid = await this.userService.validatRefreshToken(payload.id, req.cookies[process.env.REFRESH_TOKEN_KEY])
    
    //NOTE - check if refresh token is valid
    if (!refreshTokenIsValid) {
      await this.userService.replaceRefreshToken(payload.id, null);
      throw new UnauthorizedException();
    } 

    const user: UserDto = {
      id: payload.id,
      provider: null,
      username: null,
      email: payload.email,
      activeRefreshToken: req.cookies[process.env.REFRESH_TOKEN_KEY],
      TFAisenabled: payload.TFAisenabled,
      TFAsecret: null,
    };

    return user;
  }
}
