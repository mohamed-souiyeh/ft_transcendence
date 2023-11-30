/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { config } from "dotenv";
import Strategy from 'passport-42';

config();

@Injectable()
export class ftStrategy extends PassportStrategy(Strategy, '42') {
  constructor () {
    super({
      clientID: process.env.FT_APP_ID,
      clientSecret: process.env.FT_APP_SECRET,
      callbackURL: process.env.FT_REDIRECT_URI,
      profileFields: {
        id: function (obj) {
          return String(obj.id);
        },
        'username': 'login',
        'displayName': 'displayname',
        'profileUrl': 'url',
        'emails.0.value': 'email',
        'phoneNumbers.0.value': 'phone',
        'photos.0.value': 'image_url',
      },
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: ,
  ): Promise<any> {
    
  }
}
