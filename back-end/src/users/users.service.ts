/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/auth/User_DTO/User.dto';

@Injectable()
export class UsersService {
  private readonly users: UserDto[] = [
    {
      id: 1,
      provider: 'myass',
      username: 'trandandan',
      email: 'trandandan1337@gmail.com',
      activeRefreshToken: null,
      TFAisenabled: false,
      TFAsecret: 'secret',
    },
  ];

  async addUser(user: UserDto): Promise<any> {
    this.users.push(user);
    user.id = 5;
    // console.log("new users database: ");
    // console.log(this.users);
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
