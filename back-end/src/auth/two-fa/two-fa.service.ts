import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { UsersService } from 'src/database/users/users.service';

type secretAndOtpauthUrl = {
  secret: string;
  otpauthUrl: string;
};

@Injectable()
export class TwoFaService {
  constructor(private readonly usersService: UsersService) { }

  async generate2FASecretAndOTPurl(
    userEmail: string,
  ): Promise<secretAndOtpauthUrl> {
    const secret = authenticator.generateSecret();


    const options = {
      window: 2,
    };

    authenticator.options = options;

    const otpauthUrl = authenticator.keyuri(
      userEmail,
      process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
      secret,
    );

    await this.usersService.set2FAscret(userEmail, secret);

    return {
      otpauthUrl,
      secret,
    };
  }

  async streamQrCod(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  async verifyTwoFactorAuthenticationCode(
    TFAcode: string,
    userid: number,
  ): Promise<boolean> {
    const user = await this.usersService.findUserById(userid);

    if (!user) return false;

    const options = {
      window: 2,
    };

    authenticator.options = options;

    if (!user.TFASecret)
      throw new UnauthorizedException('User does not have 2FA enabled');
    const isVerified = authenticator.check(TFAcode, user.TFASecret);
    console.log('user => ', user);
    console.log('TFAcode => ', TFAcode);
    console.log('isVerified => ', isVerified);

    return isVerified;
  }

  async turnOn2FA(userid: number) {
    await this.usersService.turnOn2FA(userid);
  }

  async turnOff2FA(userid: number) {
    await this.usersService.turnOff2FA(userid);
  }
}
