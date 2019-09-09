import { Injectable } from '@nestjs/common';
import { Repository, RepositoryFactory } from 'mongo-nest';
import * as Panels from 'shared/models/tador/panels';
import { Panel } from 'shared/models/tador/panels';
import { createServer, Socket } from 'net';
import { UserService } from '../services/user.service';
import { ActionType, PanelType } from 'shared/models/tador/enum';
import { Entity } from 'shared/models';
import { ObjectId } from 'bson';

class PanelDump extends Entity {
    dump: string;
    panelId: string;
}

interface Action {
    type: ActionType;
    pId: string;
    data: any;
}

export interface RegisterAction extends Action {
    data: { type: PanelType; uId: string };
}
class StatusActionResult {
    index: number;
    data: any;
    action: ActionType;
    constructor(action: StatusActionResult) {
        Object.assign(this, action);
    }

    toString() {
        return ('00' + this.action).slice(-2) + ('0'.repeat(10) + this.index).slice(-10) + this.data;
    }
}

@Injectable()
export class TadorService {
    panelRepo: Repository<Panel>;
    panelDumpRepo: Repository<PanelDump>;
    constructor(private repositoryFactory: RepositoryFactory, private userService: UserService) {
        this.panelRepo = this.repositoryFactory.getRepository<Panel>(Panel, 'tador');
        this.panelDumpRepo = this.repositoryFactory.getRepository<PanelDump>(PanelDump, 'tador');
        this.startListen();
    }
    statuses = {};

    async addStatus(panel: Panel, type: ActionType) {
        if (!this.statuses[panel._id]) {
            this.statuses[panel._id] = [];
        }
        switch (type) {
            case ActionType.read: {
                const oldDump = (await this.panelDumpRepo.findOne({ panelId: panel.id })).dump;
                const newDump = panel.dump();
                panel.contacts.contactFields.forEach(field => {
                    const fieldLength = field.length;
                    const index = field.index;
                    for (let i = 0; i < panel.contacts.count; i++) {
                        const start = index + fieldLength * i;
                        const oldValue = oldDump ? oldDump.slice(start, start + fieldLength + 1) : undefined;
                        const newValue = newDump.slice(start, start + fieldLength + 1);
                        if (oldValue != newValue) {
                            this.statuses[panel._id].push(
                                new StatusActionResult({ action: ActionType.read, index: start, data: newValue }).toString(),
                            );
                        }
                    }
                });

                panel.settings.forEach(s => {
                    if (s.index) {
                        const newValue = newDump.slice(s.index, s.length + 1);
                        const oldValue = oldDump ? oldDump.slice(s.index, s.length + 1) : undefined;
                        if (newValue != oldValue) {
                            this.statuses[panel._id].push(
                                new StatusActionResult({ action: ActionType.read, index: s.index, data: newValue }).toString(),
                            );
                        }
                        return;
                    }

                    s.fields.forEach((f, i) => {
                        const newValue = newDump.slice(f.index, f.length + 1);
                        const oldValue = oldDump ? oldDump.slice(f.index, f.length + 1) : undefined;
                        if (newValue != oldValue) {
                            this.statuses[panel._id].push(
                                new StatusActionResult({ action: ActionType.read, index: s.index, data: newValue }).toString(),
                            );
                        }
                    });
                });
                break;
            }
            case ActionType.readAll: {
                this.statuses[panel._id].push(ActionType.readAll);
                break;
            }
            case ActionType.writeAll: {
                this.statuses[panel._id].push(ActionType.writeAll);
                break;
            }
        }
    }
    async getPanel(id: string): Promise<Panel> {
        return this.panelRepo.findOne({ _id: new ObjectId(id) });
    }
    async getDump(id: string): Promise<PanelDump> {
        return this.panelDumpRepo.findOne({ panelId: id });
    }

    startListen() {
        const port = 4000;
        const host = '0.0.0.0';
        const server = createServer();

        const listen = () => {
            server.listen(port, host, () => {
                console.log('TCP Server is running on port ' + port + '.');
            });
        };
        const close = () => {
            server.close();
        };

        listen();
        server.on('error', err => {
            console.log(err);
            close();
            listen();
        });

        server.on('connection', sock => {
            console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
            // setTimeout(() => sock.end(), 1000 * 60);
            sock.on('data', msg => {
                try {
                    const msgString = msg.toString('utf8');
                    const action: Action = JSON.parse(msgString);
                    console.log('DATA ' + sock.remoteAddress + ': ' + action);
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
                } catch (e) {
                    console.log(e);
                }
            });

            sock.on('close', () => {
                console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
            });
        });
    }

    private async register(action: RegisterAction, sock: Socket) {
        const data = action.data;
        const user = await this.userService.userRepo.findOne({ email: data.uId });
        const panel = new Panels[data.type + 'Panel']({
            name: '',
            address: '',
            userId: user.email,
        });
        const saveResult = await this.panelRepo.collection.insertOne(panel);
        sock.write(saveResult.insertedId.toHexString());
    }

    private async read(action: Action, sock: Socket, multiply = 1) {
        //let panel = await this.getPanel(action.pId);
        //panel = new Panels[panel.type + 'Panel'](panel);
        const dump = await this.getDump(action.pId);
        const start = action.data.start * multiply;
        const length = action.data.length * multiply;
        // await this.saveDump(panel);
        sock.write(dump.dump.slice(start, start + length));
    }

    private async write(action: Action, sock: Socket, multiply = 1) {
        let panel = await this.getPanel(action.pId);
        panel = new Panels[panel.type + 'Panel'](panel);
        const dump = panel.dump().split('');
        const start = action.data.start * multiply;
        const length = action.data.data.length;
        for (let i = start; i < start + length; i++) {
            dump[i] = action.data.data[i - start];
        }
        panel.reDump(dump.join(''));
        const saveResult = await this.panelRepo.saveOrUpdateOne(panel);
        await this.saveDump(panel);

        sock.write(saveResult.result.ok.toString());
    }

    private getStatus(action: Action, sock: Socket) {
        const panelStatus = this.statuses[action.pId];
        if (!panelStatus || !panelStatus.length) {
            return sock.write('0');
        }
        return sock.write(panelStatus.pop().toString());
    }

    private async saveDump(panel: Panel) {
        const dump = await this.panelDumpRepo.findOne({ panelId: panel.id });
        if (dump) {
            dump.dump = panel.dump();
        }
        return this.panelDumpRepo.saveOrUpdateOne(dump || { panelId: panel._id.toString(), dump: panel.dump() });
    }
}
