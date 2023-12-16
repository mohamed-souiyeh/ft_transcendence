import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TwoFaModule } from './auth/two-fa/two-fa.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigModuleOptions } from './ConfigModuleOptions';
import { UsersModule } from './users/users.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { SocketsModule } from './sockets/sockets.module';

@Module({
  imports: [
    AuthModule,
    TwoFaModule,
    ConfigModule.forRoot(ConfigModuleOptions),
    UsersModule,
    NestjsFormDataModule.config({ isGlobal: true, autoDeleteFile: false }),
    SocketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
