import { App, hasPermission } from 'shared';
import { ForbiddenException, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
export class GuardMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        const json = res.json;
        if (hasPermission(req.user, this.app)) {
            res.json = (a) => {
                return json.call(res, a);
            };
            return next();
        }
        return next();
        // throw new ForbiddenException();
    }
    constructor(private app: App) { }
}
