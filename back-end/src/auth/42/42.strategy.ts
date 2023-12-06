/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import Strategy from 'passport-42';
import { User, UsersService } from "src/users/users.service";


@Injectable()
export class ftStrategy extends PassportStrategy(Strategy, '42') {
  constructor (private readonly usersService: UsersService) {
    super({
      clientID: process.env["FT_APP_ID"],
      clientSecret: process.env["FT_APP_SECRET"],
      callbackURL: process.env["FT_REDIRECT_URI"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const user: User = {
      id: profile.id,
      provider: "42",
      username: profile.username,
      email: profile.emails[0].value,
    };

    const found_user = await this.usersService.finduser(user.email);

    if (!found_user) {
      this.usersService.adduser(user);
    }

    return user;
  }
}
