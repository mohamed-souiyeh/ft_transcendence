import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserDto } from 'src/users/User_DTO/User.dto';
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

  validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_KEY];
    
    const refreshTokenIsValid = this.userService.validatRefreshToken(payload.id, refreshToken);

    //NOTE - check if refresh token is valid
    if (!refreshTokenIsValid) {
      this.userService.replaceRefreshToken(payload.id, null);
      throw new UnauthorizedException();
    }

    const user: UserDto = {
      id: payload.id,
      provider: null,
      username: null,
      profilePicture: null,
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
