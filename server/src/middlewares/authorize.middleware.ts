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





// import { Injectable, NestInterceptor, ExecutionContext, CallHandler, ForbiddenException } from '@nestjs/common';
// import { UserService } from '../services/user.service';
// import { hasPermission, App, hasRole, Permission } from 'shared';
// import { Reflector } from '@nestjs/core';

// @Injectable()
// export class AuthorizeInterceptor implements NestInterceptor {
//     readonly reflector: Reflector = new Reflector();
//     constructor(private userService: UserService) {}
//     async intercept(context: ExecutionContext, next: CallHandler) {
//         const app = await this.reflector.get<App>('controllerRole', context.getClass());
//         if (!app) {
//             return next.handle();
//         }
//         const user = await this.userService.getUserAuthenticated(context.getArgs()[0].cookies.t);

//         if (!hasPermission(user, app)) {
//             throw new ForbiddenException();
//         }

//         context.getArgs()[0].user = user;
//         const permissions = this.reflector.get<Permission[]>('methodRoles', context.getHandler());
//         if (!permissions) {
//             return next.handle();
//         }
//         if (!hasRole(user, app, permissions)) {
//             throw new ForbiddenException();
//         }
//         return next.handle();
//     }
// }
