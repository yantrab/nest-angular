import { Socket } from 'net';
import { ActionType, PanelType } from 'shared/models/tador/enum';
import { RegisterAction } from './tador.service';

const client = new Socket();
const port = 4000;
const host = '128.199.41.162';
client.setMaxListeners(100);
const write = (str: string) => {
    return new Promise((resolve, reject) => {
        client.connect(port, host, function() {
            console.log('Connected');
            client.write(str);
            client.on('data', () => {
                client.end();
                client.on('close', () => {
                    resolve();
                });
            });
        });
    });
};

client.on('data', function(data) {
    console.log('Server Says : ' + data);
});

client.on('close', function() {
    console.log('Connection closed');
});

const test = async () => {
    //  ----------- REGISTER ------------
    const registerAction: RegisterAction = {
        type: ActionType.register,
        data: { type: PanelType.MP, uId: 'admin@admin.com' },
        pId: '123456',
    };
    const registerActionString = JSON.stringify(registerAction);
    await write(registerActionString);
    //  ---------------------------------

    //  ----------- STATUS ------------
    const statusAction = { type: ActionType.status, pId: '123456' };
    const statusActionString = JSON.stringify(statusAction);
    await write(statusActionString);
    //  ---------------------------------

    //  ----------- WRITE ------------
    const writeAction = { type: ActionType.write, pId: '123456', data: { start: 2551, data: 'יניב טרבלסי' } };
    const writeString = JSON.stringify(writeAction);
    await write(writeString);
    //  ---------------------------------

    //  ----------- GET CHANGES ------------
    const getAction = { type: ActionType.read, pId: '123456', data: { start: 2551, length: 100 } };
    const getString = JSON.stringify(getAction);
    await write(getString);
    //  ---------------------------------

    //  ----------- GET ALL ------------
    const getAllAction = { type: ActionType.readAll, pId: '123456', data: { start: 318, length: 10 } };
    const getAllString = JSON.stringify(getAllAction);
    await write(getAllString);
    //  ---------------------------------
};

test();
