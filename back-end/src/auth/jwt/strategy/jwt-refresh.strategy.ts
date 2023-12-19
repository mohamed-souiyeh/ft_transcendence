import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/database/users/users.service';
import { UserDto } from 'src/database/users/User_DTO/User.dto';
import { JwtPayload } from '../JwtPayloadDto/JwtPayloadDto';
import { UserStatus } from '@prisma/client';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private userService: UsersService) {
    const extractJwtFromCookie = (req) => {
      let token = null;

      if (req && req.cookies) {
        token = req.cookies[process.env.REFRESH_TOKEN_KEY];
      }
      return token;
    };

    super({
      jwtFromRequest: extractJwtFromCookie,
      secretOrKey: process.env['JWT_REFRESH_SECRET'],
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_KEY];

    const refreshTokenIsValid = this.userService.validatRefreshToken(payload.id, refreshToken);

    //NOTE - check if refresh token is valid
    if (!refreshTokenIsValid) {
      this.userService.replaceRefreshToken(payload.id, null);
      throw new UnauthorizedException();
    }

    if (payload.TFAisenabled && !payload.TFAauthenticated) {
      throw new UnauthorizedException();
    }

    //TODO - fetch the user fromt he database or the caching service to get acurret info about the user
    const user: UserDto = {
      id: payload.id,
      provider: null,
      username: null,
      avatar: null,
      score: 0,
      status: UserStatus.online,
      unreadNotifications: {
        friendRequests: 0,
      },
      email: payload.email,
      activeRefreshToken: refreshToken,
      redirectUrl: null,
      TFAisenabled: payload.TFAisenabled,
      TFAsecret: null,
    };

    console.log('refresh strategy user dto => ', user);
    return user;
  }
}
