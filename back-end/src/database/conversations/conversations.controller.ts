import { Body, Controller, Post, Req, UseGuards, Query, Get , ParseIntPipe, Delete} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwt-auth.guard';
import { IRequestWithUser } from 'src/auth/Interfaces/IRequestWithUser';
import { createChanneldto } from './channel.dto/channel.dto';
import { createDMdto } from './dmDTO/createDM.dto';

@Controller('conv')
export class ConversationsController {

  constructor(private conversationService: ConversationsService) { }

  @UseGuards(JwtAuthGuard)
  @Get('dms')
  async getDMs(@Req() req: IRequestWithUser) {
    return this.conversationService.getDMs(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('channels')
  async getChannels(@Req() req: IRequestWithUser) {
    return this.conversationService.getChannels(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('createDM')
  async createDM(@Req() req: IRequestWithUser, @Body() dmData: createDMdto) {
    return this.conversationService.createDM(req, dmData);
  }


  @UseGuards(JwtAuthGuard)
  @Post('createChannel')
  async createChannel(@Req() req: IRequestWithUser, @Body() channelData: createChanneldto) {

    return this.conversationService.createChannel(req, channelData);
  }



  @Get('search')
  async searchChannels(@Query('prefix') prefix: string): Promise<createChanneldto[]> {
    const channels = await this.conversationService.searchChannels(prefix);

    return channels;
  }


  
 

  @Post('/join')
  async joinChannel(
    @Body('channelId', ParseIntPipe) channelId: number,
    @Body('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    await this.conversationService.addUserToChannel(channelId, userId);
  }

  @Delete('/leave')
  async leaveChannel(
    @Body('channelId', ParseIntPipe) channelId: number,
    @Body('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    console.log("Je suis ici");
    await this.conversationService.removeUserFromChannel(channelId, userId);
  }

}

