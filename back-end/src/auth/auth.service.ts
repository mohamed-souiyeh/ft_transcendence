/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpRedirectResponse, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtAuthService } from './jwt/jwt.service';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { IRequestWithUser } from './Interfaces/IRequestWithUser';

@Injectable()
export class AuthService {
  constructor(private jwtAuthService: JwtAuthService, private userService: UsersService) {}

  hello(req) {
    return `hello world! from user ${req.user.email}\nof id ${req.user.id}.`;
  }

  async addTokenToCookie(res: Response, Token: string, key: string) {
    res.cookie(key, Token, {
      httpOnly: true,
      sameSite: 'strict',
      // secure: true,
    });
  }

  async refresh(req: IRequestWithUser, res: Response) {
    if (!req.user) {
      return 'No user from refresh';
    }

    //NOTE - get user from db
    const user = await this.userService.findUserById(req.user.id);

    //NOTE - check if refresh token is valid
    if (!user || user.activeRefreshToken !== req.cookies[process.env.REFRESH_TOKEN_KEY]) {
      if (user) 
        await this.userService.replaceRefreshToken(req.user.id, null);
      throw new UnauthorizedException();
    }

    //NOTE - get signed tokens
    const accessToken = await this.jwtAuthService.getJwtAcessToken(req.user);
    const refreshToken = await this.jwtAuthService.getJwtRefreshToken(req.user);

    //NOTE - add tokens to cookies
    await this.addTokenToCookie(res, accessToken, process.env.ACCESS_TOKEN_KEY);
    await this.addTokenToCookie(res, refreshToken, process.env.REFRESH_TOKEN_KEY);
    
    //NOTE - add refresh token to db
    await this.userService.replaceRefreshToken(req.user.id, refreshToken);

    return 'refreshed tokens';
  }

  async googleLogin(req: IRequestWithUser, res: Response) {
    if (!req.user) {
      return 'No user from google';
    }

    //NOTE - get signed tokens
    const accessToken = await this.jwtAuthService.getJwtAcessToken(req.user);
    const refreshToken = await this.jwtAuthService.getJwtRefreshToken(req.user);

    //NOTE - add tokens to cookies
    await this.addTokenToCookie(res, accessToken, process.env.ACCESS_TOKEN_KEY);
    await this.addTokenToCookie(res, refreshToken, process.env.REFRESH_TOKEN_KEY);
    
    //NOTE - add refresh token to db
    await this.userService.replaceRefreshToken(req.user.id, refreshToken);
    
    //NOTE - redirect to home page
    const redirect: HttpRedirectResponse = {
      // use env vars here
      url: req.user.redirectUrl,
      statusCode: 302,
    };
    //FIXME - redirect to home page
    return redirect;
  }

  async ftLogin(req: IRequestWithUser, res: Response) {
    if (!req.user) {
      return 'No user from 42';
    }

    //NOTE - get signed tokens
    const accessToken = await this.jwtAuthService.getJwtAcessToken(req.user);
    const refreshToken = await this.jwtAuthService.getJwtRefreshToken(req.user);

    //NOTE - add tokens to cookies
    await this.addTokenToCookie(res, accessToken, process.env.ACCESS_TOKEN_KEY);
    await this.addTokenToCookie(res, refreshToken, process.env.REFRESH_TOKEN_KEY);
    
    //NOTE - add refresh token to db
    await this.userService.replaceRefreshToken(req.user.id, refreshToken);

    //NOTE - redirect to home page
    const redirect: HttpRedirectResponse = {
      // use env vars here
      url: req.user.redirectUrl,
      statusCode: 302,
    };
    //FIXME - redirect to home page
    return redirect;
  }

  async logout(req: IRequestWithUser, res: Response) {

    //reset cookies
    await this.addTokenToCookie(res, '', process.env.ACCESS_TOKEN_KEY);
    await this.addTokenToCookie(res, '', process.env.REFRESH_TOKEN_KEY);
    
    //reset refresh token in db
    await this.userService.replaceRefreshToken(req.user.id, null);

    //NOTE - redirect to login page
    const redirect: HttpRedirectResponse = {
      // use env vars here
      url: process.env.LOGIN_URL,
      statusCode: 302,
    };
    //FIXME - redirect to login page
    return redirect;
  }
}
