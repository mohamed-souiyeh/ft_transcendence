/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { UsersService } from 'src/users/users.service';
import { UserDto } from '../User_DTO/User.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env['GOOGLE_CLIENT_ID'],
      clientSecret: process.env['GOOGLE_SECRET'],
      callbackURL: process.env['GOOGLE_REDIRECT_URI'],
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    //FIXME - look for the case of the profile returned by google is empty
    // const { id, name, emails } = profile;

    const user: UserDto = {
      id: null,
      provider: 'google',
      username: profile._json.name,
      email: profile._json.email,
      activeRefreshToken: null,
      TFAisenabled: false,
      TFAsecret: null,
    };

    let found_user: UserDto = await this.usersService.findUserByEmail(user.email);

    if (!found_user) {
      this.usersService.addUser(user);
    }

    //NOTE - when u make sure that the db doesnt add any thing to the user use the one u already have instead of fetching it again
    found_user = await this.usersService.findUserByEmail(user.email);

    if (found_user.TFAisenabled) {
      //NOTE - if TFA is enabled, then we need to do something here
      //NOTE - that i still dont know
    }

    return user;
  }
}
