import { Module } from '@nestjs/common';
import { PurplerainController } from './purplerain.controller';
import { PurplerainService } from './purplerain.service';

@Module({
  controllers: [PurplerainController],
  providers: [PurplerainService],
})
export class PurplerainModule {}
