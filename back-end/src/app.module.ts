import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PurplerainModule } from './purplerain/purplerain.module';
import { AuthModule } from './auth/auth.module';



@Module({
  imports: [PurplerainModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
