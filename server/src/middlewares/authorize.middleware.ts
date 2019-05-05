import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ForbiddenException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { hasPermission } from 'shared';

@Injectable()
export class AuthorizeInterceptor implements NestInterceptor {
    constructor(private userService: UserService) {}
    async intercept(context: ExecutionContext, next: CallHandler) {
        const user = await this.userService.getUserAuthenticated(context.getArgs()[0].cookies.t);
        if (!hasPermission(user, context.getClass()['app'])) {
            throw new ForbiddenException();
        }

        context.getArgs()[0].user = user;
        return next.handle();
    }
}
