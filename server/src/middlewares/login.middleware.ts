import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'shared';

@Injectable()
export class LoginInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((user: User) => {
        if (user) {
          context.getArgs()[1].setCookie('t', user._id, { path: '/' });
          return user;
        }
        return {};
      }),
    );
  }
}
