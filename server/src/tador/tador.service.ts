import { Injectable } from '@nestjs/common';
import { Repository, RepositoryFactory } from 'mongo-nest';
import * as Panels from 'shared/models/tador/panels';
import { createServer, Socket } from 'net';
import { MPPanel, Panel } from 'shared/models/tador/panels';
import { UserService } from '../services/user.service';
enum ActionType {
    register,
    readAll,
    writeAll,
    read,
    write,
    status,
}

enum PanelType {
    MP = 'MP',
}

interface Action {
    type: ActionType;
    panelId: string;
    data: any;
}
interface RegisterData {
    panelType: PanelType;
    userMail: string;
}

@Injectable()
export class TadorService {
    panelRepo: Repository<Panel>;
    constructor(private repositoryFactory: RepositoryFactory, private userService: UserService) {
        this.panelRepo = this.repositoryFactory.getRepository<Panel>(Panel, 'tador');
        this.panelRepo.findMany().then(result => {
            if (result.length) {
                return;
            }
            const panels = Array(10)
                .fill(0)
                .map(
                    (_, i) =>
                        new MPPanel({
                            phoneNumber: '234234234234',
                            address: 'חולון 24',
                            name: 'בניין ' + i,
                            userId: '5d0b0e0c7b7e3c08d4a8bd04',
                        }),
                );
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
                    case ActionType.readAll:
                        return this.readAll(action, sock);
                    case ActionType.read:
                        return this.read(action, sock);
                    case ActionType.write:
                        return this.write(action, sock);
                    case ActionType.writeAll:
                        return this.writeAll(action, sock);
                    case ActionType.status:
                        return this.status(action, sock);
                }
                sock.write(result);
            });

            sock.on('close', () => {
                console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
            });
        });
    }

    private async register(action: Action, sock: Socket) {
        const data = action.data as RegisterData;
        const user = await this.userService.userRepo.findOne({ email: data.userMail });
        const panel = new Panels[data.panelType + 'Panel']({
            name: '',
            address: '',
            userId: user.id,
            phoneNumber: action.panelId,
        });
        const saveResult = await this.panelRepo.collection.insertOne(panel);
        sock.write(saveResult.result.ok.toString());
    }

    private async readAll(action: Action, sock: Socket) {
        const panel = await this.panelRepo.findOne({ phoneNumber: action.panelId });
        sock.write(panel.dump());
    }

    private read(action: Action, sock: Socket) {
        return undefined;
    }

    private write(action: Action, sock: Socket) {
        return undefined;
    }

    private writeAll(action: Action, sock: Socket) {
        return undefined;
    }

    private status(action: Action, sock: Socket) {
        return undefined;
    }
}
