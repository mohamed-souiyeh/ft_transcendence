import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationDto } from './notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService) {}

// ! jojo's section
  async createNotification(notificationDto: NotificationDto) {
    const createdNotification = await this.prismaService.notification.create({
      data: {
        senderId: notificationDto.senderId,
        receiverId: notificationDto.receiverId,
        // createdAt est géré automatiquement par la base de données, pas besoin de le spécifier ici
      },
    });

    return createdNotification;
  }

  async getNotificationById(id: number) {
    return this.prismaService.notification.findUnique({
      where: { id },
    });
  }

  async updateNotification(id: number, notificationDto: NotificationDto) {
    return this.prismaService.notification.update({
      where: { id },
      data: {
        senderId: notificationDto.senderId,
        receiverId: notificationDto.receiverId,
        // createdAt est géré automatiquement par la base de données, pas besoin de le spécifier ici
      }
    });
  }

  async deleteNotification(id: number) {
    return this.prismaService.notification.delete({
      where: { id },
    });
  }
  //!
}

