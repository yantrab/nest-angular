import { Socket } from 'net';
const client = new Socket();
const port = 4000;
const host = 'localhost';

client.connect(port, host, function() {
    console.log('Connected');
    // client.write('1test 123456789');
    // client.write('2123456');
    // client.write('305');
    setTimeout(() => client.write('6000256'), 1000);
    // setTimeout(() => client.write('434'), 1000);
    // setTimeout(() => client.write('510'), 1000);
    //  setTimeout(() => client.write('533'), 1000);
    // setTimeout(() => client.write('5100'), 1000);
});

client.on('data', function(data) {
    console.log('Server Says : ' + data);
});

client.on('close', function() {
    console.log('Connection closed');
});
