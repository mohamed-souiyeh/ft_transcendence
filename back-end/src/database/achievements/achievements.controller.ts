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
  constructor(private readonly achievementsService: AchievementsService) {}


  @Post()
  createAchievement(@Body() achievementDto: AchievementDto) {
    return this.achievementsService.createAchievement(achievementDto);
  }

  @Get()
  getAllAchievements() {
    return this.achievementsService.getAllAchievements();
  }

  @Get(':id')
  getAchievementById(@Param('id') id: string) {
    return this.achievementsService.getAchievementById(+id);
  }

  @Put(':id')
  updateAchievement(
    @Param('id') id: string,
    @Body() achievementDto: AchievementDto,
  ) {
    return this.achievementsService.updateAchievement(+id, achievementDto);
  }

  @Delete(':id')
  deleteAchievement(@Param('id') id: string) {
    return this.achievementsService.deleteAchievement(+id);
  }
}
