import { Module } from '@nestjs/common';
import { FriendRequestsGateway } from './friend-requests/friend-requests.gateway';
import { ChatModule } from './chat/chat.module';

@Module({
  providers: [FriendRequestsGateway],
  imports: [ChatModule]
})
export class SocketsModule {}
