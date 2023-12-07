/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

export type User = {
  id: number;
  provider: string;
  username: string;
  email: string;
  TFAisenabled: boolean;
  TFAsecret?: string;
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      provider: 'myass',
      username: 'trandandan',
      email: 'trandandan1337@gmail.com',
      TFAisenabled: false,
      TFAsecret: 'secret',
    },
  ];

  async finduser(email: string): Promise<User | null> {
    const user: User = this.users.find((user) => user.email === email);
    if (typeof user === 'undefined') return null;
    return user;
  }

  async adduser(user: User): Promise<any> {
    this.users.push(user);
    user.id = 5;
    // console.log("new users database: ");
    // console.log(this.users);
  }
}
