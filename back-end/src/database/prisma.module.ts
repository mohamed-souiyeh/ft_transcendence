import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersModule } from './modules/users/users.module';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
  imports: [UsersModule],
})

export class PrismaModule {}