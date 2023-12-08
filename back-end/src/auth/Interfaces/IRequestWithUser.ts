import { Request } from 'express';
import { UserDto } from '../User_DTO/User.dto';

export interface IRequestWithUser extends Request {
  user: UserDto;
}
