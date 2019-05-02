import { App, hasPermission } from 'shared';
import { ForbiddenException, NestMiddleware, Injectable } from '@nestjs/common';
import { AuthController } from 'auth/auth.controller';
@Injectable()
export class GuardMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
       // const user = this.authController.getUserAuthenticated(req);
        if (hasPermission(req.user, this.app)) { return next(); }
        throw new ForbiddenException();
    }
    constructor(
        private app: App,
         //private authController: AuthController
         ) { }
}
