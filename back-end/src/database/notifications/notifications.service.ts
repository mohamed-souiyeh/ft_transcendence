import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationDto } from './notifications.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService,
    private readonly usersService: UsersService) { }


  async acceptFriendRequest(notification: NotificationDto) {

    const notificationToDelete = await this.prismaService.notification.findUnique({
      where: {
        id: notification.id,
        senderId: notification.senderId,
        receiverId: notification.receiverId,
      },
    });

    if (!notificationToDelete)
      throw new NotFoundException("Notification not found");

    await this.usersService.createFriendship(notification.senderId, notification.receiverId);

    return await this.deleteNotification(notification.id);
  }

  async refuseFriendRequest(notification: NotificationDto) {
    const notificationToDelete = await this.prismaService.notification.findUnique({
      where: {
        id: notification.id,
        senderId: notification.senderId,
        receiverId: notification.receiverId,
      },
    });

    if (!notificationToDelete)
      throw new NotFoundException("Notification not found");

    return await this.deleteNotification(notification.id);
  }

  async blockAndDeleteFriendRequest(notification: NotificationDto) {
    const notificationToDelete = await this.prismaService.notification.findUnique({
      where: {
        id: notification.id,
        senderId: notification.senderId,
        receiverId: notification.receiverId,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
    
    if (!notificationToDelete)
      throw new NotFoundException("Notification not found");

    const sender = notificationToDelete.sender;
    const receiver = notificationToDelete.receiver;

    await this.usersService.blockUser(receiver.id, sender.id);

    return await this.deleteNotification(notification.id);
  }

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
    return await this.prismaService.notification.findUnique({
      where: { id },
    });
  }

  async updateNotification(id: number, notificationDto: NotificationDto) {
    return await this.prismaService.notification.update({
      where: { id },
      data: {
        senderId: notificationDto.senderId,
        receiverId: notificationDto.receiverId,
        // createdAt est géré automatiquement par la base de données, pas besoin de le spécifier ici
      }
    });
  }

  async deleteNotification(id: number) {
    return await this.prismaService.notification.delete({
      where: { id },
    });
  }
  //!
}

