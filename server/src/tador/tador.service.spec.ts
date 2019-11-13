import { Socket } from 'net';
import { getRandomToken } from '../utils';
import { ActionType, PanelType } from '../../../shared/models/tador/enum';
const port = 4000;
let pId = '867057031591342';
const host = '128.199.41.162'; //'localhost';
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

    describe('register', () => {
        it('should register new panel', async () => {
            const result = '1';
            const registerAction = {
                type: ActionType.register,
                data: { type: PanelType.MP, uPhone: '0558858104', uCode: '81079', pId },
            };
            const registerActionString = JSON.stringify(registerAction);
            // {"type":1,"data":{"type":"MP","uPhone":"0558858104","uCode":"81079","pId":"1234"}}
            expect(await await write(registerActionString)).toBe(result);
        });

        it('should not register old panel', async () => {
            const result = '0';
            const registerAction = {
                type: ActionType.register,
                data: { type: PanelType.MP, uPhone: '0558858104', uCode: '81079', pId },
            };
            const registerActionString = JSON.stringify(registerAction);
            expect(await await write(registerActionString)).toBe(result);
        });

        it('should not register panel for unknown user ', async () => {
            const result = '0';
            const registerAction = { type: ActionType.register, data: { type: PanelType.MP, uPhone: '-', uCode: '81079', pId } };
            const registerActionString = JSON.stringify(registerAction);
            expect(await await write(registerActionString)).toBe(result);
        });
    });

    describe('status', () => {
        it('should return 0', async () => {
            const result = '0';
            const registerAction = {
                type: ActionType.status,
                pId,
            };
            const registerActionString = JSON.stringify(registerAction);
            // {"type":1,"data":{"type":"MP","uPhone":"0558858104","uCode":"81079","pId":"1234"}}
            expect(await await write(registerActionString)).toBe(result);
        });

        it('should return some changes', async () => {
            const result = '0';
            const registerAction = {
                type: ActionType.register,
                data: { type: PanelType.MP, uPhone: '0558858104', uCode: '81079', pId },
            };
            const registerActionString = JSON.stringify(registerAction);
            expect(await await write(registerActionString)).toBe(result);
        });

        it('should not register panel for unknown user ', async () => {
            const result = '0';
            const registerAction = { type: ActionType.register, data: { type: PanelType.MP, uPhone: '-', uCode: '81079', pId } };
            const registerActionString = JSON.stringify(registerAction);
            expect(await await write(registerActionString)).toBe(result);
        });
    });
});
