import { Socket } from 'net';
import { ActionType, PanelType } from 'shared/models/tador/enum';
import { RegisterAction } from './tador.service';

const client = new Socket();
const port = 4000;
const host = 'localhost';
client.connect(port, host, function() {
    console.log('Connected');
    const registerAction: RegisterAction = {
        type: ActionType.register,
        data: { type: PanelType.MP, uId: 'admin@admin.com' },
        pId: '12341',
    };
    // client.write(JSON.stringify(registerAction));
    client.write(JSON.stringify({ type: ActionType.status, pId: '1234' }));
    client.write(JSON.stringify({ type: ActionType.writeAll, pId: '1234' }));
});

client.on('data', function(data) {
    console.log('Server Says : ' + data);
});

client.on('close', function() {
    console.log('Connection closed');
});
