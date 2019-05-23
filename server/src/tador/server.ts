import {createServer} from 'net';
const port = 3000;
const host = '127.0.0.1';

const server = createServer();
server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port + '.');
});
server.on('connection', sock => {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sock.on('testNumber', data => {
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        const result = data.replace('test', '').trim();
        console.log('testNumber:' + data + ':' + result);
        sock.emit('testNumber', result);
    });


    sock.on('seq', data => {
        const result = data.split('').map(n => {
            let num = +n + 1;
            if (num === 10) {
                num = 0;
            }
            return num;
        })
        .join('');
        console.log('seq:' + data + ':' + result);
        sock.emit('seq', result);
    })

    // Add a 'close' event handler to this instance of socket
    sock.on('close', data => {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});