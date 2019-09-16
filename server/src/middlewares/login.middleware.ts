import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'shared';
import { UserService } from 'services/user.service';

@Injectable()
export class LoginInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((user: User) => {
                if (user) {
                    context.getArgs()[1].setCookie('t', user._id, { path: '/' });
                    context.getArgs()[0].user = user;
                    return { status: 1 };
                }
                return { status: 0 };
            }),
        );
    }
}

// tslint:disable-next-line: max-classes-per-file
@Injectable()
export class GetUserAuthenticatedInterceptor implements NestInterceptor {
    constructor(private userService: UserService) {}
    async intercept(context: ExecutionContext, next: CallHandler) {
        const user = await this.userService.getUserAuthenticated(context.getArgs()[0].cookies.t);
        context.getArgs()[0].user = user;
        return next.handle();
    }
}
