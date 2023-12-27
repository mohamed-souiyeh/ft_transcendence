import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IRequestWithUser } from 'src/auth/Interfaces/IRequestWithUser';
import { createChanneldto } from './channel.dto/channel.dto';
import { ChannelType, Role, UserState } from '@prisma/client';
import bcrypt from 'bcrypt';
import { createDMdto } from './dmDTO/createDM.dto';
@Injectable()
export class ConversationsService {
  constructor(private readonly prismaService: PrismaService) { }


//SECTION - READ operations
  async getDmMessages(dmId: number) {
    const dm = await this.prismaService.dms.findUnique({
      where: {
        id: dmId,
      },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
              },
            },
          }
        },
        users: {
          select: {
            id: true,
            username: true,
          },
        },
      }
    });

    if (dm === null) return null;

    return dm;
  }


  async getChannelMessages(channelId: number) {
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id: channelId,
      },
      include: {
        messages: {
          include: {
            sender: {
              include: {
                blockedBy: true,
              },
            },
          }
        },
        usersState: true,
      }
    });

    if (channel === null) return null;

    return channel;
  }

  async getChannel(id: number, userId: number) {
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id: id,
      },
      include: {
        users: {
          where: {
            id: userId,
          },
          include: {
            blockedUsers: {
              select: {
                id: true,
                username: true,
              }
            },
            blockedBy: {
              select: {
                id: true,
                username: true,
              }
            },
          },
        },
        usersState: true,
      }
    });

    if (channel === null) return null;

    return channel;
  }


  async getDm(id: number) {
    const dm = await this.prismaService.dms.findUnique({
      where: {
        id,
      },
      include: {
        users: {
          include: {
            blockedUsers: {
              select: {
                id: true,
                username: true,
              }
            },
          },
        },
        messages: true,
      }
    });

    if (dm === null) return null;

    return dm;
  }
//!SECTION - READ operations


//SECTION - create operations

  async createMessage(msg: any) {
    const message = await this.prismaService.message.create({
      data: {
        text: msg.text,
        senderId: msg.senderId,
        dmId: msg.dmId ? msg.dmId : null,
        channelId: msg.channelId ? msg.channelId : null,
      },
    });

    return message;
  }


  async createDM(req: IRequestWithUser, dmData: createDMdto) {
    const DMdoesExist = await this.prismaService.dms.findFirst({
      where: {
        AND: [
          { users: { some: { username: req.user.username } } },
          { users: { some: { username: dmData.username } } },
        ],
      },
    });

    if (DMdoesExist)
      return DMdoesExist;

    return await this.prismaService.dms.create({
      data: {
        users: {
          connect: [{ username: dmData.username }, { username: req.user.username }],
        },
      }
    });
  }


  async createChannel(req: IRequestWithUser, channelFromBody: createChanneldto) {
    const channelData = new createChanneldto(channelFromBody);

    if (channelData.type === ChannelType.protected && !channelData.channelPassword) {
      throw new BadRequestException("channelPassword is required for protected channels");
    }

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
            role: Role.owner,
          }
        },
        users: {
          connect: [{ username: req.user.username }],
        },
      }
    })
  }
//!SECTION - create operations
}
