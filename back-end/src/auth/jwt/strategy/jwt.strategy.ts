/* eslint-disable @typescript-eslint/no-explicit-any */
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

config({
  encoding: 'latin1',
  debug: false,
  override: false,
});

export type JwtPayload = {
  sub: number;
  email: string;
  TFAisenabled: boolean;
  TFAauthenticated?: boolean;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'myJwt') {
  constructor() {
    const extractJwtFromCookie = (req) => {
      let token = null;

      if (req && req.cookies) {
        token = req.cookies['jwt'];
      }
      return token;
    };

    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: process.env['JWT_SECRET'],
    });
  }

  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      email: payload.email,
      TFAisenabled: payload.TFAisenabled,
    };
  }
}
