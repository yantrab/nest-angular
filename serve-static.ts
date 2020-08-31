import * as fs from 'fs';
import { extname } from 'path';
const fastify = require('fastify')({ logger: true })
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
    '.gz':'application/gzip'
};
const cache = {};

fastify.get('*', (_, reply) => {
    try{
        const filePath = extname(_.raw.url) ? './client/dist' + _.raw.url : './client/dist/index.html';
        const ext = extname(filePath).toLowerCase();
        let contentType = mimeTypes[ext] || 'application/octet-stream';
        if (!cache[filePath]){
            if (fs.existsSync(filePath))
                cache[filePath] =  {file:fs.readFileSync(filePath), type:contentType}
            else {
                cache[filePath] = {file:fs.readFileSync(filePath + '.gz'), type: mimeTypes['.gz']}
            }
        }

        const file = cache[filePath];
        if (file.type === mimeTypes['.gz']){
            reply.header('Content-Encoding', 'gzip').type(file.type).send(file.file)
        } else{
            reply.type(file.type).send(file.file)
        }
    }
    catch (e) {

    }
})

// Run the server!
const start = async () => {
    try {
        await fastify.listen(4200,'0.0.0.0')
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()
