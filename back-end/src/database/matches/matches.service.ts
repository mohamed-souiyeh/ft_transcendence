import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MatchDto } from './matches.dto';

@Injectable()
export class MatchesService {
  constructor(private readonly prismaService: PrismaService) { }


  //! jojo's section 
  async findAll() {
    return await this.prismaService.match.findMany();
  }

  async findOne(id: number) {
    return await this.prismaService.match.findUnique({ where: { id } });
  }

  //Todo pour cette quoi il faux voire comment ajouter winnerstats et loserstate 
  async create(match: MatchDto) {
    await this.prismaService.user.update({
      where: { id: match.winnerId },
      data: { matchesPlayed: { increment: 1 } },
    });

    await this.prismaService.user.update({
      where: { id: match.loserId },
      data: { matchesPlayed: { increment: 1 } },
    });

    return await this.prismaService.match.create({
      data: {
        mode: match.mode,
        startedAt: match.startedAt,
        endedAt: match.endedAt,
        winner_stats: match.winnerStats,
        loser_stats: match.loserStats,
        winnerId: match.winnerId,
        loserId: match.loserId,
      }
    });
  }

  async update(id: number, updateMatch: MatchDto) {
    return await this.prismaService.match.update({
      where: { id },
      data: updateMatch,
    });
  }

  async remove(id: number) {
    return await this.prismaService.match.delete({ where: { id } });
  }


  // !
}
