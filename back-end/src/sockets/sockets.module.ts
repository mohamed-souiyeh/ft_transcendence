import { Module } from '@nestjs/common';
import { FriendRequestsGateway } from './friend-requests/friend-requests.gateway';
import { ChatModule } from './chat/chat.module';
import { AdminUiModule } from './admin-ui/admin-ui.module';

@Module({
  providers: [FriendRequestsGateway],
  imports: [ChatModule, AdminUiModule]
})
export class SocketsModule {}
