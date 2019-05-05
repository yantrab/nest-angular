import { Response } from 'express';
import { normalize } from 'nosql-normalizer';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class SuppressMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        const json = res.json;
        res.json = (result) => {
            const suppressResult = normalize(result);
            return json.call(res, suppressResult);
        };
        return next();
    }
}
