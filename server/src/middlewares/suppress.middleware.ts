import { Response } from 'express';
import { suppress } from 'suppress-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SuppressMiddleware {
    resolve = (req, res: Response, next) => {
        const json = res.json;
        res.json = (result) => {
            return json.call(res, suppress(result));
        };
        return next();
    }
}
