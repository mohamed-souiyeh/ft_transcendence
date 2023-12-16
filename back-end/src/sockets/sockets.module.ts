import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { FriendRequestsGateway } from './friend-requests/friend-requests.gateway';
import { GameInvitesGateway } from './game-invites/game-invites.gateway';

@Module({
  providers: [ChatGateway, FriendRequestsGateway, GameInvitesGateway]
})
export class SocketsModule {}
