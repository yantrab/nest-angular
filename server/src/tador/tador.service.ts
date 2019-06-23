import { Injectable } from '@nestjs/common';
import { Repository, RepositoryFactory } from 'mongo-nest';
import { NPPanel } from 'shared/models/tador/tador.model';
import { createServer, Socket } from 'net';
import { Panel } from 'shared/models/tador/tador.model';
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
interface RegisterData {
    panelType: string;
    panelPhoneNumber: string;
    userMail: any;
}

@Injectable()
export class TadorService {
    panelRepo: Repository<Panel>;

    constructor(private repositoryFactory: RepositoryFactory) {
        this.panelRepo = this.repositoryFactory.getRepository<Panel>(Panel, 'tador');
        this.panelRepo.findMany().then(result => {
            if (result.length) {
                return;
            }
            const panels = Array(10)
                .fill(0)
                .map((_, i) => new NPPanel({ address: 'חולון 24', name: 'בניין ' + i, userId: '5d0b0e0c7b7e3c08d4a8bd04' }));
            this.panelRepo.saveOrUpdateMany(panels);
        });
        this.startListen();
    }

    startListen() {
        const port = 4000;
        const host = '0.0.0.0';
        const server = createServer();

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

    private async register(action: Action, sock: Socket) {
        // const data = action.data as RegisterData;
        // const panel = new Panel();
    }
}
