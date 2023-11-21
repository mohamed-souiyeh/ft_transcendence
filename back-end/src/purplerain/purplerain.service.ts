import { Injectable } from '@nestjs/common';

@Injectable()
export class PurplerainService {
  getHello(): string {
    return 'Hello wsup! agaiiin';
  }
}
