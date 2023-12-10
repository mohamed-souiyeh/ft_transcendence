import { Module } from '@nestjs/common';
import { TwoFaController } from './two-fa.controller';
import { TwoFaService } from './two-fa.service';
import { UsersModule } from 'src/users/users.module';
import { JwtAuthModule } from '../jwt/jwt-auth.module';


@Module({
  imports: [UsersModule, JwtAuthModule],
  controllers: [TwoFaController],
  providers: [TwoFaService],
})
export class TwoFaModule {}
