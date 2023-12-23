/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './User_DTO/User.dto';
import * as crypto from 'crypto';
import { MemoryStoredFile } from 'nestjs-form-data';
import { Prisma, UserStatus, UserState, user } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';


//FIXME - dont forget to handle the error thrown by the postgresql database
//LINK - https://www.postgresql.org/docs/9.3/errcodes-appendix.html

@Injectable()
export class UsersService {

  constructor(private readonly prismaService: PrismaService) { }

  private readonly reservedUsernames: string[] = [
    "SEGV",
    "HMMD",
    "Barbarousa",
    "barbarousa",
  ];

  //SECTION - CREATE OPERATIONS

  async addUser(user: UserDto): Promise<any> {

    user.username = user.email.split('.')[0];
    const db_user = await this.prismaService.user.create({
      data: {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        provider: user.provider,
      }
    });
    return db_user;
  }
  //!SECTION


  //SECTION - READ OPERATIONS

  async getUserDataForHome(userId: number) {


    const userRelations = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        sentNotificatons: true,
        receivedNotifications: true,
        channels: true,
        dms: true,
      }
    });

    const userData = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        score: true,
        machesPlayed: true,
        email: true,
        isProfileSetup: true,
        isAuthenticated: true,
        TFAisEnabled: true,
        friendRequests: true,
      }
    });

    if (userData === null) throw new NotFoundException('User not found');

    const user = {
      ...userData,
      sentNotificatons: userRelations.sentNotificatons,
      receivedNotifications: userRelations.receivedNotifications,
      channels: userRelations.channels,
      dms: userRelations.dms,
      };

    return user;
  }

  async whoami(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        TFAisEnabled: true,
      }
    });

    if (user === null) throw new NotFoundException('User not found');

    return user;
  }

  async getStatus(id: number): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      select: {
        status: true,
      }
    });

    if (user === null) throw new NotFoundException('User not found');

    return user.status;
  }

  async findUserByUsername(username: string): Promise<any> {
    const db_user = await this.prismaService.user.findUnique({
      where: {
        username: username,
      }
    });

    if (!db_user) return null;

    return db_user;
  }

  async findUserByEmail(email: string): Promise<any> {
    const db_user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      }
    });

    if (!db_user) return null;

    return db_user;
  }

  async findUserById(id: number): Promise<any> {
    const db_user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      }
    });

    if (!db_user) return null;

    return db_user;
  }
  //!SECTION


  //SECTION - UPDATE OPERATIONS

  async setProfileSetup(id: number, state: boolean): Promise<any> {
    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        isProfileSetup: state,
      }
    });

    if (user === null) throw new NotFoundException('User not found');

    return user;
  }

  async setAuthenticated(id: number, state: boolean): Promise<any> {
    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        isAuthenticated: state,
      }
    });

    if (user === null) throw new NotFoundException('User not found');

    return user;
  }

  async setStatus(id: number, status: UserStatus): Promise<any> {
    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      }
    });

    if (user === null) throw new NotFoundException('User not found');

    return user;
  }

  async turnOff2FA(id: number) {
    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        TFAisEnabled: false,
      }
    });
    return user;
  }

  async turnOn2FA(id: number) {
    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        TFAisEnabled: true,
      }
    });
    return user;
  }

  async set2FAscret(email: string, secret: string): Promise<any> {
    const user = await this.prismaService.user.update({
      where: {
        email: email,
      },
      data: {
        TFASecret: secret,
      }
    });

    if (!user) return null;
    return user;
  }

  async updateAvatar(id: number, avatar: any): Promise<any> {
    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        avatar: avatar.path,
      }
    });

    if (user === null) throw new NotFoundException('User not found');

    return user;
  }

  async replaceRefreshToken(id: number, refreshToken: string | null): Promise<any> {
    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        activeRefreshToken: refreshToken,
      }
    });

    return user;
  }

  async updateUserUsername(id: number, username: string): Promise<any> {
    await this.checkIfUsernamUnique(username);

    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        username: username,
      }
    });

    if (user === null) throw new NotFoundException('User not found');

    return user;
  }
  //!SECTION





  //SECTION - VALIDATION OPERATIONS

  async checkIfUsernamUnique(username: string): Promise<any> {
    await this.checkUsername(username);
    const isUnique = await this.findUserByUsername(username);
    const isReserved = this.reservedUsernames.includes(username, 0);


    if (isUnique === null && !isReserved) return {
      "message": "Username is unique"
    };

    throw new ConflictException('Username already taken');
  }

  async checkUsername(username: string): Promise<any> {
    const error_msg: string = 'Username must be between 5 and 13 characters long, and contain only letters and numbers and underscores';


    const regex: RegExp = /^[a-zA-Z0-9_]{5,13}$/;


    if (!regex.test(username)) throw new ConflictException(error_msg);
  }

  async validatRefreshToken(id: number, refreshToken: string): Promise<any> {
    const user = await this.findUserById(id);

    if (user === null)
      throw new NotFoundException('User not found');

    if (user.activeRefreshToken !== refreshToken) return null;

    return user;
  }
  //!SECTION




  //! Jojo's section
  // walo '-'
  // !
}
