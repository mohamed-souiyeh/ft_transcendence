/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { User, UsersService } from 'src/users/users.service';

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

    const user: User = {
      id: profile._json.sub,
      provider: 'google',
      username: profile._json.name,
      email: profile._json.email,
      TFAisenabled: false,
    };

    const found_user = await this.usersService.finduser(user.email);

    if (!found_user) {
      this.usersService.adduser(user);
    }
    return user;
  }
}
