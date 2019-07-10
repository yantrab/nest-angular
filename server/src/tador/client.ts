import { Socket } from 'net';
import { ActionType, PanelType } from 'shared/models/tador/enum';
import { RegisterAction } from './tador.service';

const client = new Socket();
const port = 4000;
const host = 'localhost';
client.connect(port, host, function() {
    console.log('Connected');
    // send : {"type":1,"data":{"panelType":"MP","userMail":"admin@admin.com"},"panelId":"1234"}
    // return : 1
    const registerAction: RegisterAction = {
        type: ActionType.register,
        data: { type: PanelType.MP, uId: 'admin@admin.com' },
        pId: '1234',
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
