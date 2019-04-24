import { App, hasPermission } from 'shared';
import { ForbiddenException } from '@nestjs/common';
import { Response } from 'express';
export class GuardMiddleware {
    constructor(private app: App) { }
    resolve = (req, res: Response, next) => {
        const json = res.json;
        if (hasPermission(req.user, this.app)) {
            res.json = (a) => {
                return json.call(res, a);
            };
            return next();
        }
        throw new ForbiddenException();
    }
}
