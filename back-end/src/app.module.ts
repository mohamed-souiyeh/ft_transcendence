import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TwoFaModule } from './two-fa/two-fa.module';



@Module({
  imports: [AuthModule, TwoFaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
