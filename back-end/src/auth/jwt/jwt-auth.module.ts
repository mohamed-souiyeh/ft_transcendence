import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwt_expire_time } from './config/jwt.config';
import { JwtAuthService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [
    JwtModule.register({
      secret: process.env['JWT_SECRET'],
      signOptions: jwt_expire_time,
    }),
  ],
  providers: [JwtStrategy, JwtAuthService],
  exports: [JwtModule, JwtAuthService]
})
export class JwtAuthModule {}
