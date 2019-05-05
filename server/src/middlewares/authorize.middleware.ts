import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthorizeInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (
      !this.userService.isAuthorized(
        context.getArgs()[0].cookies.t,
        context.getClass()['app'],
      )
    ) {
      throw new ForbiddenException();
    }
    return next.handle();
  }
}
