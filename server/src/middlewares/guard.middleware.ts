import { Role, hasPermission } from "shared";
import { ForbiddenException } from "@nestjs/common";
export class GuardMiddleware {
    constructor(private roles: Role[]) { }
    resolve = (req, res, next) => {
        if (hasPermission(req.user, this.roles)) return next()
        throw new ForbiddenException();
    };
}