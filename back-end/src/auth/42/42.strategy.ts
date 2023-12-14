/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-42';
import { UsersService } from 'src/users/users.service';
import { UserDto } from '../../users/User_DTO/User.dto';

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
      username: profile.username,
      profilePicture: process.env.DEFAULT_AVATAR,
      email: profile.emails[0].value,
      activeRefreshToken: null,
      redirectUrl: null,
      TFAisenabled: false,
      TFAsecret: null,
    };

    let found_user: UserDto = await this.usersService.findUserByEmail(
      user.email,
    );

    if (!found_user) {
      this.usersService.addUser(user);
      //NOTE - when u make sure that the db doesnt add any thing to the user use the one u already have instead of fetching it again
      found_user = await this.usersService.findUserByEmail(user.email);
      found_user.redirectUrl = process.env.SETUP_URL;
    }
    else
    found_user.redirectUrl = process.env.HOME_URL;
  
    // console.log('42 strategy found user =>', found_user);

    if (found_user.TFAisenabled) {
      //NOTE - if TFA is enabled, then we need to do something here
      //NOTE - that i still dont know
      found_user.redirectUrl = process.env.TFA_URL;
    }
    return found_user;
  }
}
