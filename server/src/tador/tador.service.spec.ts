import { Socket } from 'net';
import { getRandomToken } from '../utils';
import { ActionType, PanelType } from '../../../shared/models/tador/enum';
const port = 4000;
let pId = '1'//'861311009983668'; //'1'//
const host = 'localhost'; //'128.199.41.162'; //
describe('tador', async () => {
    beforeAll(async () => {
        // pId = await getRandomToken();
    });
    const write = (str: string) => {
        console.log(str);
        return new Promise(resolve => {
            const client = new Socket();
            client.setMaxListeners(100);

            client.connect(port, host, function() {
                console.log('Connected');
                client.write(new Buffer([186, 35, 184]));
                client.on('data', data => {
                    console.log(data)
                    client.end();
                    client.on('close', () => {
                        console.log(data.toString());
                        return resolve(data.toString());
                    });
                });
            });
        });
    };

    describe('status', () => {
        it('should return This panel is not register!!!', async () => {
            const result = 'This panel is not register!!!';
            const registerAction = { type: ActionType.status, pId: '-1' };
            const registerActionString = JSON.stringify(registerAction);
            expect(await write(registerActionString)).toBe(result);
        });

        it('should return 0', async () => {
            const result = '0';
            const registerAction = { type: ActionType.status, pId, d: 1 };
            const registerActionString = JSON.stringify(registerAction);
            expect(await write(registerActionString)).toBe(result);
        });
        it('should return change', async () => {
            const result = '0';
            const registerAction = { type: ActionType.status, pId };
            const registerActionString = JSON.stringify(registerAction);
            expect(await write(registerActionString)).not.toBe(result);
        });

        it('should return 0 after return change', async () => {
            const result = '0';
            const registerAction = { type: ActionType.status, pId, d: 1 };
            const registerActionString = JSON.stringify(registerAction);
            expect(await write(registerActionString)).not.toBe(result);
        });
    });

    describe('read', () => {
        it('should return 0', async () => {
            const result = '0';
            const registerAction = { type: ActionType.read, pId, data: { start: 2551, length: 16 } };
            const registerActionString = JSON.stringify(registerAction);
            const res = await write(registerActionString)
            expect(res).toBe(result);
        });
    });

    describe('write', () => {
        it('should return 0', async () => {
            await write('!86705703159134200001000����201�����������������������123456    252525    123');
            //await write('!8670570315913420118500 ' + ' '.repeat(1185));
            //await write('!8670570315913420236900 ' + ' '.repeat(1185));
        });
    });
});
