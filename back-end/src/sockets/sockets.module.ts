import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { AdminUiModule } from './admin-ui/admin-ui.module';
import { MainNameSpaceModule } from './main-name-space/main-name-space.module';

@Module({
  imports: [ChatModule, AdminUiModule, MainNameSpaceModule],
  providers: [],
})
export class SocketsModule {}
