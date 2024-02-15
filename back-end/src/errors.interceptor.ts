import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError((err) => {
          const request: Request = context.switchToHttp().getRequest();
          
          Logger.debug(err, 'ErrorsInterceptor');
          return throwError(
            () =>
              new HttpException(
                {
                  message: err?.message || err?.detail || 'Something went wrong',
                  timestamp: new Date().toISOString(),
                  route: request.path,
                  method: request.method
                },
                err.status || 501
              )
          );
        })
      );
  }
}
