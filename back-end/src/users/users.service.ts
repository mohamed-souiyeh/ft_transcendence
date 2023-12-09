/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/auth/User_DTO/User.dto';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  i: number = 1;
  private readonly users: UserDto[] = [
    {
      id: this.i++,
      provider: 'myass',
      username: 'trandandan',
      email: 'trandandan1337@gmail.com',
      activeRefreshToken: null,
      TFAisenabled: false,
      TFAsecret: 'secret',
    },
    {
      id: this.i++,
      provider: 'myass',
      username: 'mohamed',
      email: 'msouiyeh@gmail.com',
      activeRefreshToken: null,
      TFAisenabled: false,
      TFAsecret: 'secret',
    }
  ];

  async addUser(user: UserDto): Promise<any> {
    
    user.id = this.i++;
    user.username =
      'user' + this.i + crypto.randomBytes(5).toString('base64');
    
    console.log('user =>', user);
    this.users.push(user);
    user.id = this.i++;

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

  async replaceRefreshToken(id: number, refreshToken: string | null): Promise<any> {
    const user: UserDto = this.users.find((user) => user.id === id);
    if (typeof user === 'undefined') return null;
    user.activeRefreshToken = refreshToken;
  }

  async validatRefreshToken(id: number, refreshToken: string): Promise<boolean> {
    const user: UserDto | null = await this.findUserById(id);
    
    if (user === null) return false;
    
    if (user.activeRefreshToken !== refreshToken) return false;
    
    return true;
  }

}
