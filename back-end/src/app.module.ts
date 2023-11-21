import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PurplerainModule } from './purplerain/purplerain.module';

@Module({
  imports: [PurplerainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
