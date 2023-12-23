import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IRequestWithUser } from 'src/auth/Interfaces/IRequestWithUser';
import { createChanneldto } from './channel.dto/channel.dto';
import { UserState } from '@prisma/client';
import bcrypt from 'bcrypt';
import { createDMdto } from './dmDTO/createDM.dto';
@Injectable()
export class ConversationsService {
  constructor(private readonly prismaService: PrismaService) {}

  

  async createDM(req: IRequestWithUser, dmData: createDMdto) {
    const DMdoesExist = await this.prismaService.dm.findFirst({
      where: {
        AND: [
          { users: { some: { username: req.user.username } } },
          { users: { some: { username: dmData.username } } },
        ],
      },
    });

    if (DMdoesExist)
      return DMdoesExist;

    return await this.prismaService.dm.create({
      data: {
        users: {
          connect: [{ username: dmData.username }, {username: req.user.username}],
        },
      }
    });
  }


  async createChannel(req: IRequestWithUser, channelFromBody: createChanneldto) {
    const channelData = new createChanneldto(channelFromBody);

    console.log("channel Data => ", channelData);
    if (channelData.channelPassword) {
      const hash = await bcrypt.hash(channelData.channelPassword, 10);
      channelData.channelPassword = hash;
    }
    
    return await this.prismaService.channel.create({
      data: {
        type: channelData.type,
        channelName: channelData.channelName,
        channelImage: process.env.DEFAULT_CHANNEL_AVATAR,
        channelDescription: channelData.channelDescription,
        channelPassword: channelData.channelPassword,
        
        ownerId: req.user.id,
        modiratorIds: [req.user.id],
        usersState: {
          create: {
            userId: req.user.id,
            state: UserState.active,
          }
        },
        users: {
          connect: [{ username: req.user.username }],
        },
      }
    })
  }
}
