import { createServer } from 'net';
const port = 3000;
const host = '0.0.0.0';

const server = createServer();
server.listen(port, host, () => {
    console.log('TCP Server is running on port ' + port + '.');
});
server.on('connection', sock => {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    sock.on('data', msg => {
        const msgString = msg.toString('utf8');
        console.log('DATA ' + sock.remoteAddress + ': ' + msgString);
        const action = +msgString[0];
        const data = msgString.slice(1);
        let result;
        switch (action) {
            case 1: {
                result = data.replace('test', '').trim();
                sock.write(result);
                break;
            }
            case 2: {
                result = data
                    .split('')
                    .map(n => {
                        let num = +n + 1;
                        if (num === 10) {
                            num = 0;
                        }
                        return num;
                    })
                    .join('');

                break;
            }

            default:
                break;
        }

        console.log(data + ':' + result);
        sock.write(result);
    });

    sock.on('close', data => {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});
