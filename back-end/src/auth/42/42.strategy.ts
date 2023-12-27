/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-42';
import { UsersService } from 'src/database/users/users.service';
import { UserDto } from '../../database/users/User_DTO/User.dto';
import { UserStatus } from '@prisma/client';

@Injectable()
export class ftStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env['FT_APP_ID'],
      clientSecret: process.env['FT_APP_SECRET'],
      callbackURL: process.env['FT_REDIRECT_URI'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const user: UserDto = {
      id: null,
      provider: '42',
      score: 0,
      machesPlayed: 0,
      username: profile.username,
      status: UserStatus.online,
      friendRequests: false,
      avatar: process.env.DEFAULT_AVATAR,
      email: profile.emails[0].value,
      activeRefreshToken: null,
      redirectUrl: null,
      TFAisEnabled: false,
      isProfileSetup: false,
      TFASecret: null,
    };

    let found_user: UserDto = await this.usersService.findUserByEmail(
      profile.emails[0].value,
    );

    if (!found_user) {
      found_user = await this.usersService.addUser(user);
    }

    found_user.redirectUrl = process.env.LOADING_URL;

    // console.log('42 strategy found user =>', found_user);

    if (found_user.TFAisEnabled) {
      //NOTE - if TFA is enabled, then we need to do something here
      //NOTE - that i still dont know
      found_user.redirectUrl = process.env.TFA_URL;
    }
    return found_user;
  }
}
