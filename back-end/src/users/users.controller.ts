import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwt-auth.guard';
import { IRequestWithUser } from 'src/auth/Interfaces/IRequestWithUser';
import { FormDataRequest } from 'nestjs-form-data';
import {
  avatarUpdateConfig,
  uploadConfig,
  usernameUpdateConfig,
} from './FormDataInterceptorConfig.ts/UploadConfig';
import { UpdateUsernameDTO, UploadDTO } from './uploadDTO/uploadDTO';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // @UseGuards(JwtAuthGuard)
  // @Post('username')
  // async updateUserUsername(
  //   @Req() req: IRequestWithUser,
  //   @Body('username') username: string,
  // ) {
  //   return this.userService.updateUserUsername(req.user.id, username);
  // }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('update/avatar')
  @FormDataRequest(avatarUpdateConfig)
  async updateUserAvatar(
    @Req() req: IRequestWithUser,
    @Body() data: UploadDTO,
  ) {
    if (data.avatar === undefined)
      throw new BadRequestException('no avatar provided');

    await this.userService.updateAvatar(req.user.id, data.avatar);
    return { message: 'avatar updated successfully'};
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('update/username')
  @FormDataRequest(usernameUpdateConfig)
  async updateUserUsername(
    @Req() req: IRequestWithUser,
    @Body() data: UpdateUsernameDTO,
  ) {
    if (data.username === undefined)
      throw new BadRequestException('no username provided');
    
    await this.userService.updateUserUsername(req.user.id, data.username);
    return { message: 'username updated successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('update')
  @FormDataRequest(uploadConfig)
  async test(@Req() req: IRequestWithUser, @Body() data: UploadDTO) {
    if (data.avatar === undefined || data.username === undefined)
      throw new BadRequestException('no avatar or username provided');

    await this.userService.updateUserUsername(req.user.id, data.username);
    await this.userService.updateAvatar(req.user.id, data.avatar);
    return { message: 'uploaded successfully' };
  }
}
