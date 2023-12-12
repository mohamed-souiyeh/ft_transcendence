
import { IsEmail } from 'class-validator';


export class UserDto {
  id: number | null;
  provider: string | null;
  username: string | null;
  profilePicture: string | null;

  //NOTE - this needs to be unique
  @IsEmail()
  email: string | null;

  //NOTE - we need to hash this for securety reasons
  activeRefreshToken: string | null;

  TFAisenabled: boolean | null;
  TFAsecret: string | null;
}
