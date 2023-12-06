// import { Module } from '@nestjs/common';
// import { PrismaService } from './prisma.service';
// import { UsersModule } from './modules/users/users.module';

// @Module({
//   providers: [PrismaService],
//   exports: [PrismaService],
//   imports: [UsersModule],
// })

// export class PrismaModule {}



// src/prisma/prisma.module.ts

import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
