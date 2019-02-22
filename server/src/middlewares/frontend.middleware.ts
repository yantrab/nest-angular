import { Injectable, NestMiddleware } from '@nestjs/common';
import {resolve} from 'path';

const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
    '.json',
];

const resolvePath = (file: string) => resolve(`../client/dist/${file}`);

@Injectable()
export class FrontendMiddleware implements NestMiddleware {
    resolve(...args: any[]) {
        return (req, res, next) => {
            const url  = req.baseUrl;
            if (url.indexOf('rest') === 1) {
                next();
            } else if (allowedExt.filter(ext => url.indexOf(ext) > 0).length > 0) {
                res.sendFile(resolvePath(url));
            } else {
                res.sendFile(resolvePath('index.html'));
            }
        };
    }
}
