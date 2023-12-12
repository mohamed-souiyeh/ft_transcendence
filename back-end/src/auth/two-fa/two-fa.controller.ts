import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { TwoFaService } from './two-fa.service';
import { JwtAuthGuard } from '../jwt/guard/jwt-auth.guard';
import { IRequestWithUser } from '../Interfaces/IRequestWithUser';
import { TFA_FormConfig } from './2FA_FormConfig/2FA_FormConfig';
import { TFACodeDTO } from './uploadCodeDTO/TFACodeDTO';
import { FormDataRequest } from 'nestjs-form-data';
import { UsersService } from 'src/users/users.service';
import { Jwt2FAAuthGuard } from '../jwt/guard/jwt-2FAauth.guard';
import { AuthService } from '../auth.service';

@Controller('2fa')
export class TwoFaController {
  constructor(
    private readonly twoFaService: TwoFaService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('generate')
  async generate2FASecretAndOTPurl(
    @Req() req: IRequestWithUser,
  ) {
    const { otpauthUrl } = await this.twoFaService.generate2FASecretAndOTPurl(
      req.user.email,
    );

    return this.twoFaService.streamQrCod(req.res, otpauthUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Post('activate')
  @HttpCode(200)
  @FormDataRequest(TFA_FormConfig)
  async activate2FA(
    @Req() req: IRequestWithUser,
    @Body() code: TFACodeDTO,
  ) {
    const isVerified =
      await this.twoFaService.verifyTwoFactorAuthenticationCode(
        code.code,
        req.user.id,
      );

    console.log('code => ', code.code);

    if (!isVerified) throw new UnauthorizedException('code is not valid');

    await this.twoFaService.turnOn2FA(req.user.id);
    await this.authService.refresh(req);
    console.log(
      'the user after 2FA activation => ',
      await this.usersService.findUserById(req.user.id),
    );
    return { message: '2FA activated successfully' };
  }

  @UseGuards(Jwt2FAAuthGuard)
  @Post('verify')
  @HttpCode(200)
  @FormDataRequest(TFA_FormConfig)
  async verify2FA(
    @Req() req: IRequestWithUser,
    @Body() code: TFACodeDTO,
  ) {
    const isVerified =
      await this.twoFaService.verifyTwoFactorAuthenticationCode(
        code.code,
        req.user.id,
      );

    if (!isVerified) throw new UnauthorizedException('code is not valid');

    await this.authService.refresh(req);
    return { message: 'code is valid' };
  }
}
