
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';


export class UserDto {
  id: number | null; //
  provider: string | null; //NOTE - needed in the database
  
  username: string | null; // 

  @Exclude()
    profilePicture: string | null; // NOTE - needed in the database

  //NOTE - this needs to be unique
  @IsEmail()
  email: string | null; // NOTE - needed in the database and required


  userStatus: string | null; // NOTE - needed in the database

  @Exclude()
  redirectUrl: string | null;

  //NOTE - we need to hash this for securety reasons
  @Exclude()
  activeRefreshToken: string | null; // NOTE - needed in the database

  @Exclude()
  TFAisenabled: boolean | null; // NOTE - needed in the database

  @Exclude()
  TFAsecret: string | null; // NOTE - needed in the database



  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
