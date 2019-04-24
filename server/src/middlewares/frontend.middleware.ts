import { Injectable, NestMiddleware } from '@nestjs/common';
import { resolve } from 'path';

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
    use(req: any, res: any, next: () => void) {
        const url = req.originalUrl;
        if (url.indexOf('rest') === 1) {
            next();
        } else if (allowedExt.filter(ext => url.indexOf(ext) > 0).length > 0) {
            res.end(resolvePath(url));
        } else {
            res.end(resolvePath('index.html'));
        }
    }
}
