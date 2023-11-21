import { Controller, Get } from '@nestjs/common';
import { PurplerainService } from './purplerain.service';

@Controller('purplerain')
export class PurplerainController {
  constructor(private readonly purplerainService: PurplerainService) {}

  @Get('wsup')
  getHello(): string {
    return this.purplerainService.getHello();
  }
}
