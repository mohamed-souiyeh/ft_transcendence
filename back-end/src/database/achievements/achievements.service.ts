import { PrismaService } from '../prisma/prisma.service';
import { Prisma, achievement } from '@prisma/client';
import { AchievementDto } from './acheivement.dto';
import { Injectable, NotFoundException } from '@nestjs/common';


@Injectable()
export class AchievementsService {
  constructor(private readonly prismaService: PrismaService) {}


  //! jojo's Section :D


  async createAchievement(achievement: AchievementDto) {
    return this.prismaService.achievement.create({ data: 
      {
        name: achievement.name,
        description: achievement.description,
        image: achievement.image
      }
    });
  }

  // * getting 
  async getAllAchievements() {
    return this.prismaService.achievement.findMany();
  }

  async getAchievementById(acheivementId: number) {
    const achievement = await this.prismaService.achievement.findUnique({
      where: { id : acheivementId },
    });

    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }

    return achievement;
  }

  // * delete
  async deleteAchievement(id: number) {
    const deletedAchievement = await this.prismaService.achievement.delete({
      where: { id },
    });

    if (!deletedAchievement) {
      throw new NotFoundException('Achievement not found');
    }

    return deletedAchievement;
  }

  // * updating
  async updateAchievement(id: number, achievement: AchievementDto) {
    const updatedAchievement = await this.prismaService.achievement.update({
      where: { id },
      data: achievement,
    });

    if (!updatedAchievement) {
      throw new NotFoundException('Achievement not found');
    }

    return updatedAchievement;
  }



  // ! 
  
}
