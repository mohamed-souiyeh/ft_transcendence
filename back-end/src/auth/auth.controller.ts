/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google/google-auth.guard';
import { JwtAuthGuard } from './jwt/guard/jwt-auth.guard';
import { ftAuthGuard } from './42/42-auth.guard';
import { Response } from 'express';
import { IRequestWithUser } from './Interfaces/IRequestWithUser';
import JwtRefreshGuard from './jwt/guard/jwt-refresh-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('hello')
  @UseGuards(JwtAuthGuard)
  hello(@Req() req: IRequestWithUser) {
    return this.authService.hello(req);
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @Req() req: IRequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req, res);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {}

  @Get('gredirect')
  @UseGuards(GoogleAuthGuard)
  @Redirect()
  async googleAuthRedirect(
    @Req() req: IRequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.googleLogin(req, res);
  }

  @Get('42')
  @UseGuards(ftAuthGuard)
  async ftAuth(@Req() req) {}

  @Get('42redirect')
  @UseGuards(ftAuthGuard)
  @Redirect()
  async ftAuthRedirect(
    @Req() req: IRequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.ftLogin(req, res);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: IRequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(req, res);
  }
}
