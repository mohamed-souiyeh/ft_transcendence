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
import { UserDto } from './User_DTO/User.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private userService: UsersService) {}

  @HttpCode(200)
  @Post('update/avatar')
  @UseGuards(JwtAuthGuard)
  @FormDataRequest(avatarUpdateConfig)
  async updateUserAvatar(
    @Req() req: IRequestWithUser,
    @Body() data: UploadDTO,
  ) {
    if (data.avatar === undefined)
      throw new BadRequestException('no avatar provided');

    await this.userService.updateAvatar(req.user.id, data.avatar);
    return { message: 'avatar updated successfully' };
  }

  @HttpCode(200)
  @Post('update/username')
  @UseGuards(JwtAuthGuard)
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

  @HttpCode(200)
  @Post('update') 
  @UseGuards(JwtAuthGuard)
  @FormDataRequest(uploadConfig)
  async updateUserData(@Req() req: IRequestWithUser, @Body() data: UploadDTO) {

    if (data.username !== undefined)
      await this.userService.updateUserUsername(req.user.id, data.username);
    if (data.avatar !== undefined)
      await this.userService.updateAvatar(req.user.id, data.avatar);

    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  async whoAmI(@Req() req: IRequestWithUser) {
    const user: UserDto = await this.userService.findUserById(req.user.id);

    return new UserDto(user);
  }

  @UseGuards()
  @Get('avatar')
  async getAvatar() {
    //REVIEW - under construction
  }
}
