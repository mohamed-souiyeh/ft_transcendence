import { IsNotEmpty, IsInt } from 'class-validator';

export class NotificationDto {
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
