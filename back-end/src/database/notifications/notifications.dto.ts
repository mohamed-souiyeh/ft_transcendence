import { IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class NotificationDto {

  @IsOptional()
  @IsInt()
  id: number;
  @IsNotEmpty()
  @IsInt()
  senderId: number;

  @IsNotEmpty()
  @IsInt()
  receiverId: number;

  // Vous n'avez pas besoin de valider la createdAt car elle sera automatiquement gérée par la base de données

  constructor(partial: Partial<NotificationDto>) {
    Object.assign(this, partial);
  }
}
