import { Role, hasPermission } from 'shared';
import { ForbiddenException } from '@nestjs/common';
import { Response } from 'express';
export class GuardMiddleware {
    constructor(private roles: Role[]) { }
    resolve = (req, res: Response, next) => {
        const json = res.json;
        if (hasPermission(req.user, this.roles)) {
            res.json = (a) => {
                return json.call(res, a);
            };
            return next();
        }
        throw new ForbiddenException();
    }
}
