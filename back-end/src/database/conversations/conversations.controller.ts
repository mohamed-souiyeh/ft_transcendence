import { Body, Controller, Post, Req, UseGuards, Query, Get , ParseIntPipe, Delete, HttpCode} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from 'src/auth/jwt/guard/jwt-auth.guard';
import { IRequestWithUser } from 'src/auth/Interfaces/IRequestWithUser';
import { createChanneldto } from './channel.dto/channel.dto';
import { createDMdto } from './dmDTO/createDM.dto';
import { eventBus } from 'src/eventBus';

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
    const createDM = await this.conversationService.createDM(req, dmData);
    eventBus.emit('DMCreated', {
      dmId: createDM,
      userId: req.user.id,
    });
    return createDM;
  }


  @UseGuards(JwtAuthGuard)
  @Post('createChannel')
  async createChannel(@Req() req: IRequestWithUser, @Body() channelData: createChanneldto) {
    console.log("channelData: ", channelData);
    const createdChannel = await this.conversationService.createChannel(req, channelData);

    for (const user of channelData.members) {
      await this.conversationService.addUserToChannel(createdChannel.id, user.id);
    }
    eventBus.emit('channelCreated', {
      channelId: channelData.id,
      userId: req.user.id,
    });

    return createdChannel;
  }


  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchChannels(@Query('prefix') prefix: string): Promise<createChanneldto[]> {
    const channels = await this.conversationService.searchChannels(prefix);

    return channels;
  }


  
 
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('/join')
  async joinChannel(
    @Body('channelId', ParseIntPipe) channelId: number,
    @Body('userId', ParseIntPipe) userId: number,
    @Body('password') password: string,
  ): Promise<void> {
    
    console.log("---------------------");
    console.log(channelId);
    console.log(userId);
    console.log(password);
    console.log("Je suis ici");


    await this.conversationService.joinChannel(channelId, userId, password);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('/leave')
  async leaveChannel(
    @Body('channelId', ParseIntPipe) channelId: number,
    @Body('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    console.log("Je suis ici");
    await this.conversationService.removeUserFromChannel(channelId, userId);
  }

}

