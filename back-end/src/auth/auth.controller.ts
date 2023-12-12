/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google/google-auth.guard';
import { JwtAuthGuard } from './jwt/guard/jwt-auth.guard';
import { ftAuthGuard } from './42/42-auth.guard';
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
    @Req() req: IRequestWithUser
  ) {
    return this.authService.refresh(req);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {}

  @Get('gredirect')
  @UseGuards(GoogleAuthGuard)
  @Redirect()
  async googleAuthRedirect(
    @Req() req: IRequestWithUser
  ) {
    return this.authService.googleLogin(req);
  }

  @Get('42')
  @UseGuards(ftAuthGuard)
  async ftAuth(@Req() req) {}

  @Get('42redirect')
  @UseGuards(ftAuthGuard)
  @Redirect()
  async ftAuthRedirect(
    @Req() req: IRequestWithUser
  ) {
    return this.authService.ftLogin(req);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: IRequestWithUser
  ) {
    return this.authService.logout(req);
  }
}
