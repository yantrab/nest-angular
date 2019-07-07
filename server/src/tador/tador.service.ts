import { Injectable } from '@nestjs/common';
import { Repository, RepositoryFactory } from 'mongo-nest';
import * as Panels from 'shared/models/tador/panels';
import { MPPanel, Panel } from 'shared/models/tador/panels';
import { createServer, Socket } from 'net';
import { UserService } from '../services/user.service';
import { ActionType, PanelType } from 'shared/models/tador/enum';
import { Entity } from 'shared/models';
import { FieldType } from 'shared/models/tador/panels';

class PanelDump extends Entity {
    dump: string;
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
    panelDumpRepo: Repository<PanelDump>;
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
                            panelId: '234234234234',
                            address: 'חולון 24',
                            actionType: ActionType.idle,
                            phoneNumber: '05522525252525',
                            name: 'בניין ' + i,
                            userId: '5d0b0e0c7b7e3c08d4a8bd04',
                        }),
                );
            this.panelRepo.saveOrUpdateMany(panels);
        });
        this.startListen();
    }
    statuses = {};

    async addStatus(panel: Panel, type: ActionType) {
        if (!this.statuses[panel.panelId]) {
            this.statuses[panel.panelId] = [];
        }
        switch (type) {
            case ActionType.read: {
                const oldDump = (await this.panelDumpRepo.findOne({ _id: panel.panelId })).dump;
                const newDump = panel.dump();
                panel.contacts.contactFields.forEach(field => {
                    const fieldLength = field.length;
                    const index = field.index;
                    for (let i = 0; i < panel.contacts.count; i++) {
                        const start = index + fieldLength * i;
                        const oldValue = oldDump.slice(start, start + fieldLength + 1);
                        const newValue = newDump.slice(start, start + fieldLength + 1);
                        if (oldValue != newValue) {
                            this.statuses[panel.panelId].push({ action: ActionType.read, index: start, data: newValue });
                        }
                    }
                });

                panel.settings.forEach(s => {
                    if (s.index) {
                        const newValue = newDump.slice(s.index, s.length + 1);
                        const oldValue = oldDump.slice(s.index, s.length + 1);
                        if (newValue != oldValue) {
                            this.statuses[panel.panelId].push({ action: ActionType.read, index: s.index, data: newValue });
                        }
                        return;
                    }

                    s.fields.forEach((f, i) => {
                        const newValue = newDump.slice(f.index, f.length + 1);
                        const oldValue = oldDump.slice(f.index, f.length + 1);
                        if (newValue != oldValue) {
                            this.statuses[panel.panelId].push({ action: ActionType.read, index: s.index, data: newValue });
                        }
                    });
                });
                break;
            }
            case ActionType.readAll: {
                this.statuses[panel.panelId].push(ActionType.readAll);
                break;
            }
            case ActionType.writeAll: {
                this.statuses[panel.panelId].push(ActionType.writeAll);
                break;
            }
        }
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
                        return this.read(action, sock, 16);
                    case ActionType.read:
                        return this.read(action, sock, 1);
                    case ActionType.write:
                        return this.write(action, sock, 1);
                    case ActionType.writeAll:
                        return this.write(action, sock, 16);
                    case ActionType.status:
                        return this.getStatus(action, sock);
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
            panelId: action.panelId,
        });
        const saveResult = await this.panelRepo.collection.insertOne(panel);
        sock.write(saveResult.result.ok.toString());
    }

    private async read(action: Action, sock: Socket, multiply = 1) {
        const panel = await this.panelRepo.findOne({ panelId: action.panelId });
        const start = action.data.start * multiply;
        const length = action.data.length * multiply;
        sock.write(panel.dump().slice(start * multiply, start + length * multiply));
        this.saveDump(panel);
    }
    private async write(action: Action, sock: Socket, multiply = 1) {
        const panel = await this.panelRepo.findOne({ panelId: action.panelId });
        const dump = panel.dump().split('');
        const start = action.data.start * multiply;
        const length = action.data.length * multiply;
        for (let i = start; i < start + length; i++) {
            dump[i] = action.data.data[i - length];
        }
        panel.reDump(dump.join(''));
        const saveResult = await this.panelRepo.saveOrUpdateOne(panel);
        sock.write(saveResult.result.ok.toString());
        this.saveDump(panel);
    }

    private getStatus(action: Action, sock: Socket) {
        const panelStatus = this.statuses[action.panelId];
        if (!panelStatus || !panelStatus.length) {
            return sock.write(0);
        }
        return sock.write(panelStatus.pop());
    }

    private saveDump(panel: Panel) {
        this.panelDumpRepo.saveOrUpdateOne({ _id: panel.panelId, dump: panel.dump() });
    }
}
