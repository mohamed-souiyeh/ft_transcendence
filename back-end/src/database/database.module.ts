import { Module } from '@nestjs/common';
import { CachingModule } from './caching/caching.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CachingModule, UsersModule]
})
export class DatabaseModule {}
