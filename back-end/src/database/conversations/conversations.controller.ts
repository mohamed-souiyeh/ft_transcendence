import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwt-auth.guard';
import { IRequestWithUser } from 'src/auth/Interfaces/IRequestWithUser';

@Controller('conv')
export class ConversationsController {

  constructor(private conversationService: ConversationsService) { }


  @UseGuards(JwtAuthGuard)
  @Post('createDM')
  async createDM(@Req() req: IRequestWithUser, @Body('username') username: string) {
    return this.conversationService.createDM(req, username);
  }

}
