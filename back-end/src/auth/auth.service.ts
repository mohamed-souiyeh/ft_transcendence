import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {
  }
  
  hello(req) {
    
    return `hello world! from user ${req.user.email}.`;
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    const payload = { email: req.user.email, sub: req.user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }


}
