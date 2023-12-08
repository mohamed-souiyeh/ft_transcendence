/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-42';
import { UsersService } from 'src/users/users.service';
import { UserDto } from '../User_DTO/User.dto';

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
      id: profile.id,
      provider: '42',
      username: profile.username,
      email: profile.emails[0].value,
      activeRefreshToken: null,
      TFAisenabled: false,
      TFAsecret: null,
    };

    let found_user: UserDto = await this.usersService.findUserByEmail(
      user.email,
    );

    if (!found_user) {
      this.usersService.addUser(user);
    }

    //NOTE - when u make sure that the db doesnt add any thing to the user use the one u already have instead of fetching it again
    found_user = await this.usersService.findUserByEmail(user.email);

    console.log('found user =>', found_user);
    if (found_user.TFAisenabled) {
      //NOTE - if TFA is enabled, then we need to do something here
      //NOTE - that i still dont know
    }

    return user;
  }
}
