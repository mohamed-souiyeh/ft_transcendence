import { AchievementsService } from './achievements.service';
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { AchievementDto } from './acheivement.dto';


@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) { }


  // @Post()
  // async createAchievement(@Body() achievementDto: AchievementDto) {
  //   return await this.achievementsService.createAchievement(achievementDto);
  // }

  // @Get()
  // async getAllAchievements() {
  //   return await this.achievementsService.getAllAchievements();
  // }

  // @Get(':id')
  // async getAchievementById(@Param('id') id: string) {
  //   return await this.achievementsService.getAchievementById(+id);
  // }

  // @Put(':id')
  // async updateAchievement(
  //   @Param('id') id: string,
  //   @Body() achievementDto: AchievementDto,
  // ) {
  //   return await this.achievementsService.updateAchievement(+id, achievementDto);
  // }

  // @Delete(':id')
  // async deleteAchievement(@Param('id') id: string) {
  //   return await this.achievementsService.deleteAchievement(+id);
  // }
}
