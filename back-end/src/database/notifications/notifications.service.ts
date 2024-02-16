import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationDto } from './notifications.dto';
import { UsersService } from '../users/users.service';
import { eventBus } from 'src/eventBus';
import { UserDto } from '../users/User_DTO/User.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService,
    private readonly usersService: UsersService) { }


  async acceptFriendRequest(notification: NotificationDto) {

    const notificationToDelete = await this.prismaService.notification.findFirst({
      where: {
        id: notification.id,
        senderId: notification.senderId,
        receiverId: notification.receiverId,
      },
    });

    const otherNotificationToDelete = await this.prismaService.notification.findFirst({
      where: {
        senderId: notification.receiverId,
        receiverId: notification.senderId,
      },
    });

    if (!notificationToDelete)
      throw new NotFoundException("Notification not found");

    if (otherNotificationToDelete)
      await this.deleteNotification(otherNotificationToDelete.id);

    await this.usersService.createFriendship(notification.senderId, notification.receiverId);

    return await this.deleteNotification(notificationToDelete.id);
  }

  async refuseFriendRequest(notification: NotificationDto) {
    const notificationToDelete = await this.prismaService.notification.findUnique({
      where: {
        id: notification.id,
        senderId: notification.senderId,
        receiverId: notification.receiverId,
      },
    });

    const otherNotificationToDelete = await this.prismaService.notification.findFirst({
      where: {
        senderId: notification.receiverId,
        receiverId: notification.senderId,
      },
    });

    if (otherNotificationToDelete)
      await this.deleteNotification(otherNotificationToDelete.id);

    if (!notificationToDelete)
      throw new NotFoundException("Notification not found");

    return this.deleteNotification(notification.id);
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
    
    const otherNotificationToDelete = await this.prismaService.notification.findFirst({
      where: {
        senderId: notification.receiverId,
        receiverId: notification.senderId,
      },
    });

    if (otherNotificationToDelete)
      await this.deleteNotification(otherNotificationToDelete.id);

    if (!notificationToDelete)
      throw new NotFoundException("Notification not found");

    const sender = notificationToDelete.sender;
    const receiver = notificationToDelete.receiver;

    await this.usersService.blockUser(receiver.id, sender.id);

    return this.deleteNotification(notification.id);
  }

  // ! jojo's section
  async createNotification(notificationDto: NotificationDto, user: UserDto) {
    const notification = await this.prismaService.notification.findFirst({
      where: {
        senderId: notificationDto.senderId,
        receiverId: notificationDto.receiverId,
      },
    });

    if (notification)
      return notification;

    const createdNotification = await this.prismaService.notification.create({
      data: {
        senderId: notificationDto.senderId,
        receiverId: notificationDto.receiverId,
        // createdAt est géré automatiquement par la base de données, pas besoin de le spécifier ici
      },
    });

    eventBus.emit('newNotification', notificationDto.receiverId, user.username);
    this.usersService.updatefriendRequests(notificationDto.receiverId, true);
    return createdNotification;
  }

  async getNotificationById(notifId: number) {
    return  this.prismaService.notification.findUnique({
      where: { id: notifId },
    });
  }

  async updateNotification(notifId: number, notificationDto: NotificationDto) {
    return  this.prismaService.notification.update({
      where: { id: notifId },
      data: {
        senderId: notificationDto.senderId,
        receiverId: notificationDto.receiverId,
        // createdAt est géré automatiquement par la base de données, pas besoin de le spécifier ici
      }
    });
  }

  async deleteNotification(notifId: number) {
    return this.prismaService.notification.delete({
      where: { 
        id: notifId
      },
    });
  }
  //!
}

