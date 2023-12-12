import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class Jwt2FAAuthGuard extends AuthGuard('2FAauth') {}
