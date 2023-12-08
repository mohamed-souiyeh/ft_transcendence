import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TwoFaModule } from './two-fa/two-fa.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigModuleOptions } from './ConfigModuleOptions';


@Module({
  imports: [AuthModule, TwoFaModule, ConfigModule.forRoot(ConfigModuleOptions)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
