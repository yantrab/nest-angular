import { createServer } from 'net';
const port = 3000;
const host = '0.0.0.0';
let temp = '';
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

            case 3: {
                result = '';
                for (let i = 1; i <= +data; i++) {
                    for (let j = 0; j < 512; j++) {
                        result += ('0' + i).slice(-2);
                    }
                }
                break;
            }
            case 4: {
                result = data;
                temp += result;
                break;
            }
            case 5: {
                if (data === '00000') {
                    temp = '';
                    result = 'reset';
                } else {
                    result = temp.slice(0, +data);
                    for (let i = result.length; i < +data; i++) {
                        result += '-';
                    }
                }
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
