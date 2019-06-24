import { Socket } from 'net';
enum ActionType {
    register,
    readAll,
    writeAll,
    read,
    write,
    status,
}

interface Action {
    type: ActionType;
    panelId: string;
    data: any;
}
enum PanelType {
    MP = 'MP',
}
interface RegisterData {
    panelType: PanelType;
    userMail: any;
}
const client = new Socket();
const port = 4000;
const host = 'localhost';
const action: Action = {
    type: ActionType.register,
    data: { panelType: PanelType.MP, userMail: 'admin@admin.com' } as RegisterData,
    panelId: '0558858104',
};
client.connect(port, host, function() {
    console.log('Connected');
    // client.write('1test 123456789');
    // client.write('2123456');
    // client.write('305');
    client.write(JSON.stringify(action));
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
