import { Socket } from 'net';
import { getRandomToken } from '../utils';
import { ActionType, PanelType } from '../../../shared/models/tador/enum';
const port = 4000;
let pId = '867057031591342';
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
                client.write(str);
                client.on('data', data => {
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
        it('should return 0', async () => {
            const result = '0';
            const registerAction = { type: ActionType.status, pId };
            const registerActionString = JSON.stringify(registerAction);
            expect(await await write(registerActionString)).toBe(result);
        });
        it('should return 0', async () => {
            const result = '0';
            const registerAction = { type: ActionType.status, pId, d: 1 };
            const registerActionString = JSON.stringify(registerAction);
            expect(await await write(registerActionString)).toBe(result);
        });
    });

    describe('read', () => {
        it('should return 0', async () => {
            const result = '0';
            const registerAction = { type: ActionType.read, pId, data: { start: 2551, length: 100 } };
            const registerActionString = JSON.stringify(registerAction);
            expect(await await write(registerActionString)).toBe(result);
        });
    });
});
