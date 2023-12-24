import { NotificationsService } from './notifications.service';
import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { NotificationDto } from './notifications.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) { }


  // @Post()
  // async createNotification(@Body() notificationDto: NotificationDto) {
  //   return await this.notificationService.createNotification(notificationDto);
  // }

  // @Get(':id')
  // async getNotificationById(@Param('id') id: number) {
  //   return await this.notificationService.getNotificationById(id);
  // }

  // @Put(':id')
  // async updateNotification(@Param('id') id: number, @Body() notificationDto: NotificationDto) {
  //   return await this.notificationService.updateNotification(id, notificationDto);
  // }

  // @Delete(':id')
  // async deleteNotification(@Param('id') id: number) {
  //   return await this.notificationService.deleteNotification(id);
  // }

}
