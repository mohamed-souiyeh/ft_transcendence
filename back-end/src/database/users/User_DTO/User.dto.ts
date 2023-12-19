
import { UserStatus } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { unreadNotificationsDto } from '../unreadNotification_DTO/unreadNotification.dto';


export class UserDto {
  id: number; //
  
  username: string; // 
  
  score: number;
  
  @IsEmail()
  email: string;
  @Exclude()
  avatar: string;
  
  status: UserStatus;
  
  provider: string;

  @Exclude()
  TFAsecret: string | null;

  @Exclude()
  TFAisenabled: boolean;

  unreadNotifications: unreadNotificationsDto; //TODO - replace object with unread notification type declaration


  @Exclude()
  redirectUrl: string | null;

  //NOTE - we need to hash this for securety reasons
  @Exclude()
  activeRefreshToken: string | null; // NOTE - needed in the database

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
