import { Module } from '@nestjs/common';
import { MainNameSpaceGateway } from './main-name-space.gateway';
import { UsersModule } from 'src/database/users/users.module';
import { JwtAuthModule } from 'src/auth/jwt/jwt-auth.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [UsersModule, JwtAuthModule, ChatModule],
  providers: [MainNameSpaceGateway]
})
export class MainNameSpaceModule {}
