/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './User_DTO/User.dto';
import * as crypto from 'crypto';
import { MemoryStoredFile } from 'nestjs-form-data';
import { Prisma, UserStatus, UserState } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';


//FIXME - dont forget to handle the error thrown by the postgresql database
//LINK - https://www.postgresql.org/docs/9.3/errcodes-appendix.html

@Injectable()
export class UsersService {

  constructor(private readonly prismaService: PrismaService) {}

  i: number = 1;

  private readonly reservedUsernames: string[] = [
    "SEGV",
    "HMMD",
    "Barbarousa",
    "barbarousa",
  ];
  private readonly users: UserDto[] = [
    {
      id: this.i++,
      provider: 'myass',
      username: 'trandandan',
      score: 0,
      unreadNotifications: {
        friendRequests: 0,
      },
      avatar: process.env.DEFAULT_AVATAR,
      email: 'trandandan1337@gmail.com',
      activeRefreshToken: null,
      status: UserStatus.offline,
      redirectUrl: null,
      TFAisenabled: false,
      TFAsecret: null,
    },
    {
      id: this.i++,
      provider: 'myass',
      username: 'mohamed',
      score: 0,
      unreadNotifications: {
        friendRequests: 0,
      },
      avatar: process.env.DEFAULT_AVATAR,
      email: 'msouiyeh@gmail.com',
      //FIXME - this needs to be hashed for security reasons
      activeRefreshToken: null,
      status: UserStatus.offline,
      redirectUrl: null,
      TFAisenabled: false,
      TFAsecret: null,
    },
  ];

  async turnOff2FA(id: number) {
    const user: UserDto = await this.findUserById(id);

    user.TFAisenabled = false;
  }

  async turnOn2FA(id: number) {
    const user: UserDto = await this.findUserById(id);

    user.TFAisenabled = true;
  }

  async set2FAscret(email: string, secret: string): Promise<any> {
      const user: UserDto | null = await this.findUserByEmail(email);

      if (!user) return null;

      user.TFAsecret = secret;
  }

  async updateAvatar(id: number, avatar: any): Promise<any> {
    const user: UserDto | null = await this.findUserById(id);

    if (user === null) throw new NotFoundException('User not found');

    user.avatar = avatar.path;

    console.log(
      'user after avatar update and re query => ',
      await this.findUserById(id),
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
    await this.checkUsername(username);
    await this.checkIfUsernamUnique(username);

    const user: UserDto | null = await this.findUserById(id);

    console.log("user before update => ", user)

    if (user === null) throw new NotFoundException('User not found');

    user.username = username;

    console.log("user after update and re query => ", (await this.findUserById(id)))
  }

  async addUser(user: UserDto): Promise<any> {
    user.id = this.i++;
    user.username = 'user' + this.i + crypto.randomBytes(5).toString('base64');

    // console.log('user =>', user);
    this.users.push(user);
    user.id = this.i++;
  }

  async findUserByUsername(username: string): Promise<UserDto | null> {
    const user: UserDto = this.users.find((user) => user.username === username);

    if (typeof user === 'undefined') return null;

    return user;
  }

  async findUserByEmail(email: string): Promise<UserDto | null> {
    const user: UserDto = this.users.find((user) => user.email === email);

    if (typeof user === 'undefined') return null;

    return user;
  }

  async findUserById(id: number): Promise<UserDto | null> {
    const user: UserDto = this.users.find((user) => user.id === id);

    if (typeof user === 'undefined') return null;

    return user;
  }

  async replaceRefreshToken(
    id: number,
    refreshToken: string | null,
  ): Promise<boolean | null> {
    const user: UserDto = this.users.find((user) => user.id === id);
    if (typeof user === 'undefined') return null;
    user.activeRefreshToken = refreshToken;

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
