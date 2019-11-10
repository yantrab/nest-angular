import { Socket } from 'net';
import { ActionType, PanelType } from 'shared/models/tador/enum';

const client = new Socket();
const port = 4000;
const host = '128.199.41.162';
client.setMaxListeners(100);
const write = (str: string) => {
    return new Promise((resolve, reject) => {
        client.connect(port, host, function() {
            console.log('Connected');
            client.write(str);
            client.on('data', data => {
                client.end();
                client.on('close', () => {
                    resolve(data.toString());
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
let pId: any = '5d7219d024cba11c06c38e1d';
const test = async () => {
    //  ----------- REGISTER ------------
    const registerAction = { type: ActionType.register, data: { type: PanelType.MP, uId: 'hadar453@012.net.il' } };
    const registerActionString = JSON.stringify(registerAction);
    await write(registerActionString);
    // 5d7219d024cba11c06c38e1d
    //  ---------------------------------
    //  ----------- STATUS ------------{type:6,pId:"?"}
    const statusAction = { type: ActionType.status, pId };
    const statusActionString = JSON.stringify(statusAction);
    for (let i = 0; i < 10; i++) await write(statusActionString);
    //  ---------------------------------

    //  ----------- WRITE ------------
    const writeAction = { type: ActionType.write, pId, data: { start: 2551, data: 'יניב טרבלסי' } };
    const writeString = JSON.stringify(writeAction);
    await write(writeString);
    //  ---------------------------------

    //  ----------- GET CHANGES ------------
    const getAction = { type:4, pId:'?', data: { start: 2551, length: 100 } };
    const getString = JSON.stringify(getAction);
    await write(getString);
    //  ---------------------------------

    //  ----------- GET ALL ------------
    const getAllAction = { type: 3, pId:'?', data: { start: 318, length: 10 } };
    const getAllString = JSON.stringify(getAllAction);
    await write(getAllString);
    //  ---------------------------------
};

test();
