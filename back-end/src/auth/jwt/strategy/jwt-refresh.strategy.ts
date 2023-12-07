import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    const extractJwtFromCookie = (req) => {
      let token = null;

      if (req && req.cookies) {
        token = req.cookies['refreshToken'];
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
    const refreshToken = req.cookies['refreshToken'];
    return {
      ...payload,
      refreshToken,
    };
  }
}
