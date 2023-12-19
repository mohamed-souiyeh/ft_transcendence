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

  i: number = 1;

  private readonly reservedUsernames: string[] = [
    "SEGV",
    "HMMD",
    "Barbarousa",
    "barbarousa",
  ];
  // private readonly users: UserDto[] = [
  //   {
  //     id: this.i++,
  //     provider: 'myass',
  //     username: 'trandandan',
  //     score: 0,
  //     unreadNotifications: {
  //       friendRequests: 0,
  //     },
  //     avatar: process.env.DEFAULT_AVATAR,
  //     email: 'trandandan1337@gmail.com',
  //     activeRefreshToken: null,
  //     status: UserStatus.offline,
  //     redirectUrl: null,
  //     TFAisEnabled: false,
  //     TFASecret: null,
  //   },
  //   {
  //     id: this.i++,
  //     provider: 'myass',
  //     username: 'mohamed',
  //     score: 0,
  //     unreadNotifications: {
  //       friendRequests: 0,
  //     },
  //     avatar: process.env.DEFAULT_AVATAR,
  //     email: 'msouiyeh@gmail.com',
  // // FIXME - this needs to be hashed for security reasons
  //     activeRefreshToken: null,
  //     status: UserStatus.offline,
  //     redirectUrl: null,
  //     TFAisEnabled: false,
  //     TFASecret: null,
  //   },
  // ];


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

    console.log(
      'user after status update and re query => ',
      user,
    );
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

    console.log(
      'user after avatar update and re query => ',
      user,
    );
  }

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

    console.log("user before update => ", user)

    if (user === null) throw new NotFoundException('User not found');

    console.log("user after update and re query => ", user);
  }

  //NOTE - DONE
  async addUser(user: UserDto): Promise<any> {

    user.username = user.email.split('@')[0];
    const db_user = await this.prismaService.user.create({
      data: {
        username: user.username,
        score: user.score,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        provider: user.provider,
        TFASecret: user.TFASecret,
        TFAisEnabled: user.TFAisEnabled,
        unreadNotifications: user.unreadNotifications,
        activeRefreshToken: user.activeRefreshToken,
      }
    });
    console.log("db_user => ", db_user);
    return db_user;
  }

  async findUserByUsername(username: string): Promise<UserDto | null> {
    const db_user = await this.prismaService.user.findUnique({
      where: {
        username: username,
      }
    });

    console.log("db_user => ", db_user);
    if (!db_user) return null;
    const user: UserDto = {
      id: db_user.id,
      username: db_user.username,
      score: db_user.score,
      email: db_user.email,
      avatar: db_user.avatar,
      status: db_user.status,
      provider: db_user.provider,
      TFASecret: db_user.TFASecret,
      TFAisEnabled: db_user.TFAisEnabled,
      unreadNotifications: db_user.unreadNotifications as Prisma.InputJsonObject,
      activeRefreshToken: db_user.activeRefreshToken,

      redirectUrl: null,
    };
    
    return user;
  }

  async findUserByEmail(email: string): Promise<UserDto | null> {
    const db_user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      }
    });

    if (!db_user) return null;

    const user: UserDto = {
      id: db_user.id,
      username: db_user.username,
      score: db_user.score,
      email: db_user.email,
      avatar: db_user.avatar,
      status: db_user.status,
      provider: db_user.provider,
      TFASecret: db_user.TFASecret,
      TFAisEnabled: db_user.TFAisEnabled,
      unreadNotifications: db_user.unreadNotifications as Prisma.InputJsonObject,
      activeRefreshToken: db_user.activeRefreshToken,

      redirectUrl: null,
    };
    return user;
  }

  async findUserById(id: number): Promise<UserDto | null> {
    const db_user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      }
    });

    if (!db_user) return null;

    const user: UserDto = {
      id: db_user.id,
      username: db_user.username,
      score: db_user.score,
      email: db_user.email,
      avatar: db_user.avatar,
      status: db_user.status,
      provider: db_user.provider,
      TFASecret: db_user.TFASecret,
      TFAisEnabled: db_user.TFAisEnabled,
      unreadNotifications: db_user.unreadNotifications as Prisma.InputJsonObject,
      activeRefreshToken: db_user.activeRefreshToken,

      redirectUrl: null,
    };

    return user;
  }

  async replaceRefreshToken(
    id: number,
    refreshToken: string | null,
  ): Promise<boolean | null> {
    await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        activeRefreshToken: refreshToken,
      }
    });

    return true;
  }

  async validatRefreshToken(
    id: number,
    refreshToken: string,
  ): Promise<boolean> {
    const user: UserDto | null = await this.findUserById(id);

    if (user === null) return false;

    if (user.activeRefreshToken !== refreshToken) return false;

    return true;
  }
}
