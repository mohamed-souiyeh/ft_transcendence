/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google/google-auth.guard';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

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
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Get('42redirect')
  ftAuthRedirect(@Req() req) {
    
  }
}
