import { Injectable, NestMiddleware } from '@nestjs/common';
import { resolve } from 'path';
import { createReadStream } from 'fs';

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
    use(req: any, reply: any, next: () => void) {
        const url = req.originalUrl;
        if (url.indexOf('rest') === 1) {
            next();
        } else if (allowedExt.filter(ext => url.indexOf(ext) > 0).length > 0) {
            const stream = createReadStream(resolvePath(url));
            // reply.write(stream,'text/html');
            reply.type('text/html').send(stream);
        } else {
            const stream = createReadStream(resolvePath('index.html'));
            //.write(stream,'text/html');
            reply.type('text/html').send(stream);
        }
    }
}
