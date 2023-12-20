import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [UsersModule, ConversationsModule, MatchesModule]
})
export class DatabaseModule {}
