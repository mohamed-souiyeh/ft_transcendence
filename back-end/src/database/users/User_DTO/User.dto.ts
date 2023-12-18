
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';


export class UserDto {
  id: number | null; //
  provider: string | null;
  username: string | null; //

  @Exclude()
    profilePicture: string | null; // served

  //NOTE - this needs to be unique
  @IsEmail()
  email: string | null; //

  @Exclude()
  redirectUrl: string | null;

  //NOTE - we need to hash this for securety reasons
  @Exclude()
  activeRefreshToken: string | null;

  @Exclude()
  TFAisenabled: boolean | null;

  @Exclude()
  TFAsecret: string | null;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
