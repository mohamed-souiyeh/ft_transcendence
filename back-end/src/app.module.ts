import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TwoFaModule } from './auth/two-fa/two-fa.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigModuleOptions } from './ConfigModuleOptions';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { SocketsModule } from './sockets/sockets.module';
import { DatabaseModule } from './database/database.module';
import { gameModule } from './game/game.module';

@Module({
  imports: [
    AuthModule,
    TwoFaModule,
    ConfigModule.forRoot(ConfigModuleOptions),
    NestjsFormDataModule.config({ isGlobal: true, autoDeleteFile: false }),
    gameModule,
    SocketsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
