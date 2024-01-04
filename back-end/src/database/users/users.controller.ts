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

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private userService: UsersService) {}

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
  async updateUserData(@Req() req: IRequestWithUser, @Body() data: UploadDTO) {

    if (data.username !== undefined)
      await this.userService.updateUserUsername(req.user.id, data.username);
    if (data.avatar !== undefined){
      console.log("data.avatar => ", data.avatar);
      await this.userService.updateAvatar(req.user.id, data.avatar as any);
    }
    await this.userService.setProfileSetup(req.user.id, true);

    console.log("updatd successfully");
    return true;
  }


  // @Get('test')
  // async test() {
  //   return this.userService.setScore(1, 1000);
  // }

  @UseGuards()
  @Get('avatar')
  async getAvatar() {
    //REVIEW - under construction
    return {message: "under construction"};
  }
}
