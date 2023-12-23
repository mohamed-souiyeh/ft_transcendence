import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MatchDto } from './matches.dto';

@Injectable()
export class MatchesService {
  constructor(private readonly prismaService: PrismaService) {}


//! jojo's section 
  findAll() {
    return this.prismaService.match.findMany();
  }

  findOne(id: number) {
    return this.prismaService.match.findUnique({ where: { id } });
  }

  //Todo pour cette quoi il faux voire comment ajouter winnerstats et loserstate 
  // create(match: MatchDto) {
  //   return this.prismaService.match.create({ data: 
  //     {
  //       mode: match.mode,

  //     }
  //      });
  // }

  update(id: number, updateMatch: MatchDto) {
    return this.prismaService.match.update({
      where: { id },
      data: updateMatch,
    });
  }

  remove(id: number) {
    return this.prismaService.match.delete({ where: { id } });
  }


  // !
}
