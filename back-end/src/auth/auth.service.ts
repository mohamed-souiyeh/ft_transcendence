import { Injectable } from '@nestjs/common';
import { JwtAuthService } from './jwt/jwt.service';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private jwtAuthService: JwtAuthService) {}

  hello(req) {
    console.log(req);
    return `hello world! from user ${req.user.email}\nof id ${req.user.userId}.`;
  }


  addTokenToCookie(res: Response, accessToken: string): void {
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
  }

  googleLogin(req: Request, res: Response) {
    if (!req.user) {
      return 'No user from google';
    }

    const { accessToken } = this.jwtAuthService.login(req.user);

    this.addTokenToCookie(res, accessToken);

    return req.user;
  }

  ftLogin(req: Request, res: Response) {
    if (!req.user) {
      return 'No user from 42';
    }

    const { accessToken } = this.jwtAuthService.login(req.user);

    this.addTokenToCookie(res, accessToken);

    return req.user;
  }
}
