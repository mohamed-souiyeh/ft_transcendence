import { NotificationsService } from './notifications.service';
import { BadRequestException, Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationDto } from './notifications.dto';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwt-auth.guard';
import { IRequestWithUser } from 'src/auth/Interfaces/IRequestWithUser';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) { }

  @UseGuards(JwtAuthGuard)
  @Post('friend-request')
  async createNotification(@Req() req: IRequestWithUser, @Body() notificationDto: NotificationDto) {
    if (notificationDto.senderId !== req.user.id)
      throw new BadRequestException("what do u think u are doing?");
    if (notificationDto.receiverId === notificationDto.senderId)
      throw new BadRequestException("You can't send a friend request to yourself");
    return await this.notificationService.createNotification(notificationDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('friend-request/accept')
  async acceptFriendRequest(@Req() req: IRequestWithUser, @Body() notificationDto: NotificationDto) {
    if (notificationDto.receiverId !== req.user.id)
      throw new BadRequestException("opertion not permited, friend request is not yours");
    await this.notificationService.acceptFriendRequest(notificationDto);
    return { message: "Friend request accepted" };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('friend-request/refuse')
  async refuseFriendRequest(@Req() req: IRequestWithUser, @Body() notificationDto: NotificationDto) {
    if (notificationDto.receiverId !== req.user.id)
      throw new BadRequestException("opertion not permited, friend request is not yours");
    await this.notificationService.refuseFriendRequest(notificationDto);
    return { message: "Friend request refused" };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('friend-request/block')
  async blockAndDeleteFriendRequest(@Req() req: IRequestWithUser, @Body() notificationDto: NotificationDto) {
    if (notificationDto.receiverId !== req.user.id)
      throw new BadRequestException("opertion not permited, friend request is not yours");
    await this.notificationService.blockAndDeleteFriendRequest(notificationDto);
    return { message: "Friend request blocked and deleted" };
  }
}
