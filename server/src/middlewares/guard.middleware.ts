import { Role, canActivate } from "shared";
import { ForbiddenException } from "@nestjs/common";
export class GuardMiddleware {
    constructor(private roles: Role[]) { }
    resolve = (req, res, next) => {
        if (canActivate(req.user, this.roles)) return next()
        throw new ForbiddenException();
    };
}