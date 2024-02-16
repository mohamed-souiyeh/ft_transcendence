/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './User_DTO/User.dto';
import * as crypto from 'crypto';
import { MemoryStoredFile } from 'nestjs-form-data';
import { Prisma, UserStatus, UserState, user, ChannelType } from '@prisma/client';
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
    "setup",
    "profile",
    "search",
    "not-found",
    "groups",
    "game",
    "loading",
    "login",
    "2fa",
    "bot",
    "chat",
    "home",

  ];

  //SECTION - CREATE OPERATIONS

 
  async createAchievement(userId: number, achievementName: string):Promise<any>
  {
    console.log("User ", userId);
    const achievement = await this.prismaService.achievement.findUnique({
      where: { name: achievementName },
    });
    
    if (!achievement) {
      throw new Error(`Achievement with name ${achievementName} does not exist`);
      return null;
    }
    
    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        achievements:{
        connect:{
          id: achievement.id
        }
       }
      }
    });

    return user;
  }

  async createFriendship(userId: number, friendId: number): Promise<any> {
    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          connect: {
            id: friendId,
          }
        }
      }
    });

    await this.prismaService.user.update({
      where: {
        id: friendId,
      },
      data: {
        friends: {
          connect: {
            id: userId,
          }
        }
      }
    });

    return user;
  }

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





  
  async getScore(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      }
    });

    if (user === null) throw new NotFoundException('User not found');

    return user.score;
  }


  async getNetworkData(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        blockedUsers: {
          select: {
            id: true,
            username: true,
            status: true,
          }
        },
        friends: {
          select: {
            id: true,
            username: true,
            status: true,
          }
        },
        receivedNotifications: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
              }
            },
            receiver: {
              select: {
                id: true,
                username: true,
              }
            },
          },
        },
      }
    });

    if (user === null) null;

    this.updatefriendRequests(userId, false);

    return {
      blockedUsers: user.blockedUsers,
      friends: user.friends,
      friendRequests: user.receivedNotifications,
    };
  }


  async getUserFriends(userId: number): Promise<any> {
    const friends = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        friends: true,
      }
    });

    if (friends === null) null;

    return friends;
  }

  async getUserConvs(userId: number): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        channels: {
          include: {
            usersState: true,
          },
        },
        dms: true,
      }
    });

    if (user === null) null;

    return user;
  }


  async getUserDataForHome(userId: number) {


    const userRelations = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
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
        matchesPlayed: true,
        wins: true,
        email: true,
        isProfileSetup: true,
        isAuthenticated: true,
        TFAisEnabled: true,
        friendRequests: true,
      }
    });

    if (userData === null) null;

    const user = {
      ...userData,
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
        isProfileSetup: true,
        isAuthenticated: true,
      }
    });

    if (user === null) null;

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

    if (user === null) null;

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

  async removeFriendship(userId: number, friendId: number): Promise<any> {
    const findUser = await this.findUserById(userId);
    const findFriend = await this.findUserById(friendId);

    if (findUser === null || findFriend === null)
      throw new NotFoundException('User not found');

    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          disconnect: {
            id: friendId,
          }
        }
      }
    });

    await this.prismaService.user.update({
      where: {
        id: friendId,
      },
      data: {
        friends: {
          disconnect: {
            id: userId,
          }
        }
      }
    });

    return user;
  }


  async updatefriendRequests(id: number, state: boolean): Promise<any> {
    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        friendRequests: state,
      }
    });

    return user;
  }


  async removeNotification(userId: number, otherUserId: number): Promise<any> {
    const notification = await this.prismaService.notification.findFirst({
      where: {
        senderId: otherUserId,
        receiverId: userId,
      }
    });

    if (notification)
      await this.prismaService.notification.delete({
        where: {
          id: notification.id,
        }
      });
    
    const otherNotification = await this.prismaService.notification.findFirst({
      where: {
        senderId: userId,
        receiverId: otherUserId,
      }
    });

    if (otherNotification)
      await this.prismaService.notification.delete({
        where: {
          id: otherNotification.id,
        }
      });
  }

  async blockUser(userId: number, blockedUserId: number): Promise<any> {
    const findUser = await this.findUserById(userId);
    const findBlockedUser = await this.findUserById(blockedUserId);

    if (findUser === null || findBlockedUser === null)
      throw new NotFoundException('User not found');

    //TODO - we need to check if there is a notification too and remove it

    await this.removeFriendship(userId, blockedUserId);

    await this.removeNotification(userId, blockedUserId);

    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        blockedUsers: {
          connect: {
            id: blockedUserId,
          }
        }
      }
    });

    return user;
  }

  async unblockUser(userId: number, blockedUserId: number): Promise<any> {
    const findUser = await this.findUserById(userId);
    const findBlockedUser = await this.findUserById(blockedUserId);

    if (findUser === null || findBlockedUser === null)
      throw new NotFoundException('User not found');

    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        blockedUsers: {
          disconnect: {
            id: blockedUserId,
          }
        }
      }
    });

    return user;
  }


  async setScore(id: number, score: number): Promise<any> {
    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        score: score,
      }
    });

    return user;
  }

  async setProfileSetup(id: number, state: boolean): Promise<any> {
    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        isProfileSetup: state,
      }
    });

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

    return user;
  }

  async setBusyStatus(id: number): Promise<any> {
    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        status: UserStatus.busy,
      }
    });

    return user;
  }

  async setOnlineStatus(id: number): Promise<any> {
    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        status: UserStatus.online,
      }
    });

    return user;
  }

  async setOfflineStatus(id: number): Promise<any> {
    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        status: UserStatus.offline,
      }
    });

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
    // console.log("avatar => ", avatar);
    const user = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: {
        avatar: avatar.path,
      }
    });

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


    const regex: RegExp = /^[a-zA-Z0-9][a-zA-Z0-9_]{4,12}$/;


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
  async searchUsersByUsernamePrefix(prefix: string, authenticatedUserId: number): Promise<UserDto[]> {
    const users = await this.prismaService.user.findMany({
      where: {
        username: {
          startsWith: prefix,
        },  

        blockedBy: {
          none: {
            id: authenticatedUserId,
          },
        },
      },
    });

    // Mapper les utilisateurs à UserDto
    return users.map(user => new UserDto(user));
  }


  async getUserAvatar(userId: number): Promise<string> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { 
        avatar: true
      },
    });

    if (!user) {
      throw new Error('User introuvable');
    }

    return user.avatar;
  }


  async getUserData(username: string): Promise<any> {

  
    const user = await this.prismaService.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        score: true,
        wins: true,
        loses: true,
        matchesPlayed: true,
        status: true,
        achievements: true,
        wonMatches: {
          include: {
          winner: {
              select: {
                username: true,
                id: true,

            },
          },
          loser: {
            select: {
              username: true,
              id: true,
            },
          },
          
        } ,
      },
        lostMatches:{
          include: {
            winner: {
              select: {
                username: true,
                id: true,
              },
            },
            loser: {
              select: {
                username: true,
                id: true,
              },
            },

          },

        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    //const allMatches = [...user.wonMatches, ...user.lostMatches].sort((a, b) => a.id - b.id);

    const allMatches = [...user.wonMatches, ...user.lostMatches].sort((a, b) => {
      return new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime();
    });
    

    return {
      id: user.id,
      username: user.username,
      score: user.score,
      wins: user.wins,
      loses: user.loses,
      matchesPlayed: user.matchesPlayed,
      status: user.status,
      achievements: user.achievements,
      allMatches,
    };
  }



  async getLeaderboard(): Promise<any> {
    const leaderboard = await this.prismaService.user.findMany({
      take: 10, 
      orderBy: {
        score: 'desc', 
      },
      where: {
        matchesPlayed: {
          gt: 0,
        }
      },
      select: {
        id: true,
        username: true,
        score: true,
        matchesPlayed: true,
        wins: true,
        loses: true,
      },
    });

    return leaderboard;
  }

  async hasSentNotification(senderId: number, receiverId: number): Promise<any> {
    const notification = await this.prismaService.notification.findFirst({
      where: {
        senderId,
        receiverId,
      },  
    });

    const friendship = await this.prismaService.user.findFirst({
      where: {
        id: senderId,
        friends: {
          some: {
            id: receiverId,
          },
        },
      },
    });
  
    return {
      isPending: !!notification,
      Notification: notification,
      isFriend: !!friendship,
      }; 
  }



  async getBlockStatus(userId: number, otherUserUsername: string): Promise<any> {
    const hasBlocked = await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            id: userId,
            blockedUsers: {
              some: {
                username: otherUserUsername,
              },
            },
          },
          {
            id: userId,
            blockedBy: {
              some: {
                username: otherUserUsername,
              },
            },
          },
        ],
      },
    });
  
    return {
      isBlocked: !!hasBlocked
    };

  }
  

  // !
}
