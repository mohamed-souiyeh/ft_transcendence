import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh.strategy';
import { UsersModule } from 'src/users/users.module';
import { Jwt2FAStrategy } from './strategy/jwt-2FAauth.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule,
  ],
  providers: [JwtStrategy, JwtAuthService, JwtRefreshTokenStrategy, Jwt2FAStrategy],
  exports: [JwtModule, JwtAuthService],
})
export class JwtAuthModule {}
