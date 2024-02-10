/* eslint-disable @typescript-eslint/no-explicit-any */
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


  //SECTION - DELETE operations


  async deleteChannel(channelId: number) {

    const channel = await this.prismaService.channel.findUnique({
      where: { id: channelId },
      include: { users: true },
    });

    for (const user of channel.users) {
      await this.prismaService.channel.update({
        where: { id: channelId },
        data: {
          users: { disconnect: { id: user.id } },
        },
      });
    }

    // Delete all user states related to the channel
    await this.prismaService.userState.deleteMany({
      where: { channelId: channelId },
    });

    // Delete all messages related to the channel
    await this.prismaService.message.deleteMany({
      where: { channelId: channelId },
    });


    await this.prismaService.channel.delete({
      where: {
        id: channelId,
      },
    });
    return;
  }




  //!SECTION - DELETE operations


  //SECTION - UPDATE operations

  async setChannelPassword(channelId: number, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const channel = await this.prismaService.channel.update({
      where: {
        id: channelId,
        type: ChannelType.protected,
      },
      data: {
        channelPassword: hash,
      },
    });

    return channel;
  }

  async setChanneltype(channelId: number, type: ChannelType, password: string | null = null) {

    // console.log("type => ", type);

    if (type === ChannelType.protected && password) {
      return await this.setChanneltoProtected(channelId, password);
    }
    else if (type === ChannelType.public) {
      return await this.setChanneltoPublic(channelId);
    }
    else if (type === ChannelType.private) {
      return await this.setChanneltoPrivate(channelId);
    }

    return null;
  }

  async setChanneltoProtected(channelId: number, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const channel = await this.prismaService.channel.update({
      where: {
        id: channelId,
      },
      data: {
        type: ChannelType.protected,
        channelPassword: hash,
      },
    });

    return channel;
  }

  async setChanneltoPublic(channelId: number) {
    const channel = await this.prismaService.channel.update({
      where: {
        id: channelId,
      },
      data: {
        type: ChannelType.public,
        channelPassword: null,
      },
    });

    return channel;
  }

  async setChanneltoPrivate(channelId: number) {
    const channel = await this.prismaService.channel.update({
      where: {
        id: channelId,
      },
      data: {
        type: ChannelType.private,
        channelPassword: null,
      },
    });

    return channel;
  }

  async updateUserRole(channelId: number, userId: number, role: Role) {
    const userState = await this.prismaService.userState.findFirst({
      where: {
        userId: userId,
        channelId: channelId,
      },
    });

    const updatedUserState = await this.prismaService.userState.update({
      where: {
        id: userState.id,
      },
      data: {
        role: role,
      },
    });

    return updatedUserState;
  }

  async updateUserState(channelId: number, userId: number, state: UserState, until: Date | null = null) {
    const userState = await this.prismaService.userState.findFirst({
      where: {
        userId: userId,
        channelId: channelId,
      },
    });

    const updatedUserState = await this.prismaService.userState.update({
      where: {
        id: userState.id,
      },
      data: {
        state: state,
        untile: until,
      },
    });

    return updatedUserState;
  }

  async addUserToChannel(channelId: number, userId: number) {

    const userState = await this.prismaService.userState.findFirst({
      where: {
        userId: userId,
        channelId: channelId,
      },
    });

    if (userState) {
      return;
    }

    const channel = await this.prismaService.channel.update({
      where: {
        id: channelId,
      },
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
        usersState: {
          create: {
            userId: userId,
            state: UserState.active,
            role: Role.user,
          },
        },
      },
    });

    return channel;
  }

  async removeUserFromChannel(channelId: number, userId: number) {

    const userState = await this.prismaService.userState.findFirst({
      where: {
        userId: userId,
        channelId: channelId,
      },
    });

    if (!userState) {
      return;
    }

    const channel = await this.prismaService.channel.update({
      where: {
        id: channelId,
      },
      data: {
        users: {
          disconnect: {
            id: userId,
          },
        },
        usersState: {
          delete: {
            id: userState.id,
          },
        },
      },
    });
    return channel;
  }



  //!SECTION - UPDATE operations


  //SECTION - READ operations

  async getDMs(userId: number) {
    const dms = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        dms: {
          include: {
            users: {
              select: {
                id: true,
                username: true,
              },
            },

          },
        },
      },
    });

    return {
      id: dms.id,
      username: dms.username,
      dms: dms.dms,
    };
  }


  async getChannels(userId: number) {
    const channels = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        channels: {
          include: {
            users: {
              select: {
                id: true,
                username: true,
              },
            },
            usersState: true,
          },
        },
      },
    });

    return {
      id: channels.id,
      username: channels.username,
      channels: channels.channels,
    };
  }

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
        ]
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (DMdoesExist)
      return DMdoesExist;

    return await this.prismaService.dms.create({
      data: {
        users: {
          connect: [{ username: dmData.username }, { username: req.user.username }],
        },
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }


  async createChannel(req: IRequestWithUser, channelFromBody: createChanneldto) {
    if (channelFromBody.type === ChannelType.dm)
      throw new BadRequestException('You cannot create a channel of type DM');
    const channelData = new createChanneldto(channelFromBody);

    if (channelData.type === ChannelType.protected && !channelData.channelPassword) {
      throw new BadRequestException("channelPassword is required for protected channels");
    }

    // console.log("channel Data => ", channelData);
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








  async searchChannels(prefix: string): Promise<createChanneldto[]> {
    const channels = await this.prismaService.channel.findMany({
      where: {
        channelName: {
          startsWith: prefix,
        },
        OR: [
          {
            type: 'public',
          },
          {
            type: 'protected',
          },
        ],
      },
    });

    return channels.map(channel => new createChanneldto(channel));
  }



  async joinChannel(channelId: number, userId: number, password: string | null = null): Promise<void> {
    // Check if the channel and user exist
    const channel = await this.prismaService.channel.findUnique({
      where: { id: channelId },
    });

    
    if (!channel) {
      throw new BadRequestException('Channel does not exist');
    }
    
    console.log('password => ', password);
    // console.log('channel => ', channel);
    if (channel.type === ChannelType.protected && password) {
      const isCorrect = await bcrypt.compare(password, channel.channelPassword);
      console.log('isCorrect => ', isCorrect);
      if (!isCorrect) {
        throw new BadRequestException('Incorrect password');
      }
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

  
    await this.addUserToChannel(channelId, userId);

    // i need to think about user state :D here 

  }


}
