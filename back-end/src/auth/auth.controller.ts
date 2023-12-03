/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google/google-auth.guard';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { ftAuthGuard } from './42/42-auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('hello')
  @UseGuards(JwtAuthGuard)
  hello(@Req() req: Request) {
    return this.authService.hello(req);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {}

  @Get('gredirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.googleLogin(req, res);
  }

  @Get('42')
  @UseGuards(ftAuthGuard)
  async ftAuth(@Req() req) {}

  @Get('42redirect')
  @UseGuards(ftAuthGuard)
  ftAuthRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.ftLogin(req, res);
  }
}
