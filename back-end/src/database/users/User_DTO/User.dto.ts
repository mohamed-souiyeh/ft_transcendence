
import { UserStatus } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';


export class UserDto {
  id: number; //

  username: string; // 

  score: number;

  machesPlayed: number;

  @IsEmail()
  email: string;
  @Exclude()
  avatar: string;

  status: UserStatus;

  provider: string;

  @Exclude()
  TFASecret: string | null;

  TFAisEnabled: boolean;

  isProfileSetup: boolean;

  friendRequests: boolean;

  @Exclude()
  redirectUrl: string | null;

  //NOTE - we need to hash this for securety reasons
  @Exclude()
  activeRefreshToken: string | null; // NOTE - needed in the database

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
