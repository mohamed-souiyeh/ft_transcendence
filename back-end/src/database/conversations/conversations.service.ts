import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IRequestWithUser } from 'src/auth/Interfaces/IRequestWithUser';

@Injectable()
export class ConversationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createDM(req: IRequestWithUser, username: string) {
    return await this.prismaService.dm.create({
      data: {
        users: {
          connect: [{ username: username }, {username: req.user.username}],
        },
      }
    });
  }
}
