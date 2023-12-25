import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/database/users/users.module';
import { JwtAuthModule } from 'src/auth/jwt/jwt-auth.module';

@Module({
  imports: [AuthModule, UsersModule, JwtAuthModule],
  controllers: [],
  providers: [ChatGateway, ChatService],
  exports: [ChatGateway],
})
export class ChatModule {}
