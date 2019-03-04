import { Response } from 'express';
import { suppress } from 'suppress-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SuppressMiddleware {
    resolve = (req, res: Response, next) => {
        const json = res.json;
        res.json = (result) => {
            const suppressResult = suppress(result, 'id');
            return json.call(res, suppressResult);
        };
        return next();
    }
}
