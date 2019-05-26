import { Socket } from 'net';
const client = new Socket();
const port = 3000;
const host = '128.199.41.162';

client.connect(port, host, function() {
    console.log('Connected');
    // client.write('1test 123456789');
    client.write('2123456');
});

client.on('data', function(data) {
    console.log('Server Says : ' + data);
});

client.on('close', function() {
    console.log('Connection closed');
});
