import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule,
  ],
  providers: [JwtStrategy, JwtAuthService, JwtRefreshTokenStrategy],
  exports: [JwtModule, JwtAuthService],
})
export class JwtAuthModule {}
