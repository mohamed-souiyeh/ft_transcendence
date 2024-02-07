/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  Query,
  Param, 
  NotFoundException, 
  ParseIntPipe,
  Res
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwt-auth.guard';
import { IRequestWithUser } from 'src/auth/Interfaces/IRequestWithUser';
import { FormDataRequest } from 'nestjs-form-data';
import {
  avatarUpdateConfig,
  uploadConfig,
  usernameUpdateConfig,
} from './FormDataInterceptorConfig/UploadConfig';
import { UpdateUsernameDTO, UploadDTO } from './uploadDTO/uploadDTO';
import { Response } from 'express';
import { join } from 'path';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private userService: UsersService) {}


  @Get('friends')
  @UseGuards(JwtAuthGuard)
  async getUserFriends(@Req() req: IRequestWithUser) {
    const userFriends = await this.userService.getUserFriends(req.user.id);

    return userFriends;
  }

  @Get('network')
  @UseGuards(JwtAuthGuard)
  async getUserNetwork(@Req() req: IRequestWithUser) {
    const user = await this.userService.getNetworkData(req.user.id);

    return user;
  }

  @Get('allforhome')
  @UseGuards(JwtAuthGuard)
  async getUserDataForHome(@Req() req: IRequestWithUser) {
    const user = await this.userService.getUserDataForHome(req.user.id);

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  async whoAmI(@Req() req: IRequestWithUser) {
    const user = await this.userService.whoami(req.user.id);

    return user;
  }

  @HttpCode(200)
  @Post('update/avatar')
  @UseGuards(JwtAuthGuard)
  @FormDataRequest(avatarUpdateConfig)
  async updateUserAvatar(@Req() req: IRequestWithUser, @Body() data: UploadDTO) {
    if (data.avatar === undefined)
      throw new BadRequestException('no avatar provided');

    await this.userService.updateAvatar(req.user.id, data.avatar);
    return { message: 'avatar updated successfully' };
  }

  @HttpCode(200)
  @Post('update/username')
  @UseGuards(JwtAuthGuard)
  @FormDataRequest(usernameUpdateConfig)
  async updateUserUsername(@Req() req: IRequestWithUser, @Body() data: UpdateUsernameDTO,) {
    if (data.username === undefined)
      throw new BadRequestException('no username provided');

    await this.userService.updateUserUsername(req.user.id, data.username);
    return { message: 'username updated successfully' };
  }

  @HttpCode(200)
  @Post('update') 
  @UseGuards(JwtAuthGuard)
  @FormDataRequest(uploadConfig)
  async updateUserData(@Req() req: IRequestWithUser, @Body() data: any) {

    console.log("data => ", data);
    if (data.username !== undefined)
      await this.userService.updateUserUsername(req.user.id, data.username);
    if (data.avatar !== undefined){
      console.log("data.avatar => ", data.avatar);
      await this.userService.updateAvatar(req.user.id, data.avatar as any);
    }
    await this.userService.setProfileSetup(req.user.id, true); //FIXME - uncomment this line

    // console.log("updatd successfully");
    return true;
  }



  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('block')
  async blockUser(@Req() req: IRequestWithUser, @Body('id', ParseIntPipe) id: number) {
    if (req.user.id === id)
      throw new BadRequestException("what do you think you are doing?!");
    await this.userService.blockUser(req.user.id, id);

    return { message: 'user blocked successfully' };
  }


  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('unblock')
  async unblockUser(@Req() req: IRequestWithUser, @Body('id', ParseIntPipe) id: number) {
    if (req.user.id === id)
      throw new BadRequestException("what do you think you are doing?!");
    await this.userService.unblockUser(req.user.id, id);

    return { message: 'user unblocked successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('unfriend')
  async unfriendUser(@Req() req: IRequestWithUser, @Body('id', ParseIntPipe) id: number) {
    if (req.user.id === id)
      throw new BadRequestException("what do you think you are doing?!");
    await this.userService.removeFriendship(req.user.id, id);

    return { message: 'user unfriended successfully' };
  }

//! jojo's part
  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchUsersByUsernamePrefix(@Query('prefix') prefix: string, @Req() req: IRequestWithUser): Promise<any> {

    console.log("prefix => ", prefix);
    const users = await this.userService.searchUsersByUsernamePrefix(prefix, req.user.id);

    const finalUsers = users.map((user) => {
      return {
        id: user.id,
        username: user.username,
        score: user.score,
        machesPlayed: user.machesPlayed,
        status: user.status,
        //TODO add avatar;
      };
    });

    return finalUsers;
  }

  



  @UseGuards(JwtAuthGuard)
  @Get(':userId/avatar')
  async getUserAvatar(@Param('userId', ParseIntPipe) userId: number, @Res() res: Response): Promise<void> {
    try {
      const avatarPath = await this.userService.getUserAvatar(userId);
      res.sendFile(avatarPath);
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Utilisateur ou Avatar non trouvé');
    }
  }



  @UseGuards(JwtAuthGuard)
  @Get('Public_data/:username')
  async getUserByUsername(@Param('username') username: string): Promise<any> { 
    try {
      const userData = await this.userService.getUserData(username);
      return userData;
    } catch (error) {
      throw new NotFoundException('User not found'); 
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('leaderboard')
  async getLeaderboard(): Promise<any> {
    try {
      const leaderboard = await this.userService.getLeaderboard();
      return leaderboard;
    } catch (error) {
      throw new NotFoundException('Leaderboard not found');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('check_notification')
  async hasSentNotification(@Query('receiverId', ParseIntPipe) Id: number, @Req() req: IRequestWithUser): Promise<any> {
    return this.userService.hasSentNotification(req.user.id, Id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check_blocked')
  async getBlockedStatus(@Query('otherUserUsername') otherUserusername: string, @Req() req: IRequestWithUser): Promise<any> {
    return this.userService.getBlockStatus(req.user.id, otherUserusername);
  }
  
  //!

}
