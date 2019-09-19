import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NestMiddleware } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'shared';
import { UserService } from 'services/user.service';

@Injectable()
export class FrontendMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: Function) {
        if (req.url.startsWith('/site')) {
            // return res.
        }
        next();
    }
}
