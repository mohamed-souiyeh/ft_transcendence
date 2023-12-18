import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google/google.strategy';
import { UsersModule } from 'src/database/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ftStrategy } from './42/42.strategy';
import { JwtAuthModule } from './jwt/jwt-auth.module';
// import { config } from 'dotenv';

// config({
//   encoding: 'latin1',
//   debug: true,
//   override: false,
// });

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ session: false }),
    JwtAuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, ftStrategy],
  exports: [AuthService],
})
export class AuthModule { }
