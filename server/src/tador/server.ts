import { createServer, Socket } from 'net';

enum ActionType {
    register,
    getStatus,
    readAll,
    writeAll,
    read,
    write,
}

interface Action {
    type: ActionType;
    panelId: string;
    data: any;
}

const port = 4000;
const host = '0.0.0.0';
let temp = '';
const server = createServer();

export class TadorPanelSocketManager {
    constructor() {
        server.listen(port, host, () => {
            console.log('TCP Server is running on port ' + port + '.');
        });

        server.on('connection', sock => {
            console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
            sock.on('data', msg => {
                const action: Action = JSON.parse(msg.toString('utf8'));
                console.log('DATA ' + sock.remoteAddress + ': ' + action);
                let result = '';
                switch (action.type) {
                    case ActionType.register:
                        return this.register(action, sock);
                }
                sock.write(result);
            });

            sock.on('close', data => {
                console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
            });
        });
    }

    private register(action: Action, sock: Socket) {}
}
