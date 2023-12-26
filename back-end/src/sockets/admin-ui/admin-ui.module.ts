import { Module } from '@nestjs/common';
import { AdminUiGateway } from './admin-ui.gateway';

@Module({
  providers: [AdminUiGateway]
})
export class AdminUiModule {}
