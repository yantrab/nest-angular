import { Response } from 'express';
import { normalize } from 'nosql-normalizer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SuppressMiddleware {
    resolve = (req, res: Response, next) => {
        const json = res.json;
        res.json = (result) => {
            const suppressResult = normalize(result);
            return json.call(res, suppressResult);
        };
        return next();
    }
}
