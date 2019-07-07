import { Socket } from 'net';
import { ActionType } from 'shared/models/tador/enum';

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
client.connect(port, host, function() {
    console.log('Connected');
    // send : {"type":1,"data":{"panelType":"MP","userMail":"admin@admin.com"},"panelId":"1234"}
    // return :1
    const registerAction: Action = {
        type: ActionType.register,
        data: { type: PanelType.MP, userMail: 'admin@admin.com' },
        panelId: '1234',
    };
    client.write(JSON.stringify(registerAction));
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
