import { Socket } from 'net';
const client = new Socket();
const port = 3000;
const host = '0.0.0.0';

client.connect(port, host, function() {
    console.log('Connected');
    // client.write('1test 123456789');
    // client.write('2123456');
    // client.write('305');
    setTimeout(() => client.write('412'), 100);
    setTimeout(() => client.write('434'), 1000);
    setTimeout(() => client.write('510'), 1000);
    //  setTimeout(() => client.write('533'), 1000);
    // setTimeout(() => client.write('5100'), 1000);
});

client.on('data', function(data) {
    console.log('Server Says : ' + data);
});

client.on('close', function() {
    console.log('Connection closed');
});
