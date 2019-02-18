import { Role, canActivate } from "shared";
export class GuardMiddleware {
    constructor(private roles: Role[]) { }
    resolve(...args: any[]) {
        return (req, res, next) => {
            if (canActivate(req.user, this.roles)) return next()
            return {};
        };
    }
}