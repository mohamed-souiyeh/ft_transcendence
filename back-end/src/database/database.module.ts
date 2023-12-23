import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MatchesModule } from './matches/matches.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AchievementsModule } from './achievements/achievements.module';

@Module({
  imports: [UsersModule, ConversationsModule, MatchesModule, NotificationsModule, AchievementsModule],
  controllers: [],
})
export class DatabaseModule {}
