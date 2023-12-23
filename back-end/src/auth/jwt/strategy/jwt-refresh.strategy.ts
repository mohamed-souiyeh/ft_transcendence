import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/database/users/users.service';
import { JwtPayload } from '../JwtPayloadDto/JwtPayloadDto';

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

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_KEY];

    const refreshTokenIsValid = await this.userService.validatRefreshToken(payload.id, refreshToken);

    //NOTE - check if refresh token is valid
    if (!refreshTokenIsValid) {
      await this.userService.replaceRefreshToken(payload.id, null);
      await this.userService.setAuthenticated(payload.id, false);
      await this.userService.setStatus(payload.id, 'offline');
      throw new UnauthorizedException('refresh token is not valid');
    }

    if (payload.TFAisEnabled && !payload.TFAauthenticated) {
      throw new UnauthorizedException('TFA is enabled but not authenticated');
    }
    console.log("refresh token is valid => ", refreshTokenIsValid);

    const user = {
      ...refreshTokenIsValid,
      TFAauthenticated: payload.TFAauthenticated,
    }
    console.log('jwt refresh strategy user =>', user);
    return user;
  }
}
