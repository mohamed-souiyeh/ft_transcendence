import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    // console.log('AuthInterceptor');

    return next.handle().pipe(
      catchError((err, caught) => {
        if (err instanceof UnauthorizedException) {
          const res: Response = context.switchToHttp().getResponse<Response>();

          res.redirect(401, process.env.LOGIN_URL);

        }
        return caught;
      },)
    );
  }
}
