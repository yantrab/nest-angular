import { Injectable, Logger } from '@nestjs/common';
import { Repository, RepositoryFactory } from 'mongo-nest';
import * as Panels from 'shared/models/tador/panels';
import { Panel, Source } from 'shared/models/tador/panels';
import { createServer, Socket } from 'net';
import { ActionType, PanelType } from 'shared/models/tador/enum';
import { Entity } from 'shared/models';
import { keyBy, values } from 'lodash';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

class PanelDump extends Entity {
    dump: string;
    panelId: string;
}

interface Action {
    type: ActionType;
    pId: string;
    data: any;
}
const logger = new Logger();
const TIMEOUT = 1000 * 30;
class StatusActionResult {
    index: number;
    data: any;
    action: ActionType;
    constructor(action: StatusActionResult) {
        logger.log(JSON.stringify(action));
        Object.assign(this, action);
    }

    toString() {
        return ('00' + this.action).slice(-2) + ('0'.repeat(10) + this.index).slice(-10) + this.data;
    }
}

@Injectable()
@WebSocketGateway(4001, {})
export class TadorService {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('register')
    async onRegister(sock, message) {
        const pId = message;
        this.clientSockets[pId] = sock;
    }

    @SubscribeMessage('unregister')
    async onUnRegister(sock, message) {
        const pId = message;
        delete this.clientSockets[pId];
    }
    unregister;

    clientSockets: { [pId: string]: Socket } = {};
    panelRepo: Repository<Panel>;
    panelDumpRepo: Repository<PanelDump>;
    constructor(private repositoryFactory: RepositoryFactory) {
        this.panelRepo = this.repositoryFactory.getRepository<Panel>(Panel, 'tador');
        this.panelDumpRepo = this.repositoryFactory.getRepository<PanelDump>(PanelDump, 'tador');
        // this.startListen();
        this.startListenToPanels();
    }
    statuses: { [id: string]: { panel: Panel; arr: string[] } } = {};

    async updatePanel(panel: Panel) {
        logger.log('save panel ' + panel.panelId);
        const oldDump = (await this.getDump(panel.panelId)).dump;
        const newDump = panel.dump();
        panel.contacts.changesList = panel.contacts.changesList || [];
        panel.contacts.contactFields.forEach(field => {
            const fieldLength = field.length;
            const index = field.index;
            for (let i = 0; i < panel.contacts.count; i++) {
                const start = index + fieldLength * i;
                const oldValue = oldDump ? oldDump.slice(start, start + fieldLength) : undefined;
                const newValue = newDump.slice(start, start + fieldLength);
                if (oldValue != newValue) {
                    panel.contacts.changesList[i] = panel.contacts.changesList[i] || {};
                    panel.contacts.changesList[i][field.property] = Source.client;
                }
            }
        });
        await this.panelRepo.saveOrUpdateOne(panel);
        return panel;
    }
    async addStatus(panel: Panel, type: ActionType) {
        logger.log('add status: ' + type);
        if (!this.statuses[panel.panelId]) {
            this.statuses[panel.panelId] = { panel, arr: [] };
        }
        switch (type) {
            case ActionType.read: {
                const oldpanelStatus = keyBy(this.statuses[panel.panelId].arr, 'index');
                const oldDump = (await this.getDump(panel.panelId)).dump;
                const newDump = panel.dump();
                panel.contacts.contactFields.forEach(field => {
                    const fieldLength = field.length;
                    const index = field.index;
                    for (let i = 0; i < panel.contacts.count; i++) {
                        const start = index + fieldLength * i;
                        const oldValue = oldDump ? oldDump.slice(start, start + fieldLength) : undefined;
                        const newValue = newDump.slice(start, start + fieldLength);
                        if (oldValue != newValue) {
                            logger.log(field.title);
                            oldpanelStatus[start] = new StatusActionResult({
                                action: ActionType.read,
                                index: start,
                                data: newValue,
                            }).toString();
                        }
                    }
                });

                panel.settings.forEach(s => {
                    if (s.index) {
                        const length = s.fields.length * s.length;
                        if (length < 60) {
                            const newValue = newDump.slice(s.index, s.index + length);
                            const oldValue = oldDump ? oldDump.slice(s.index, s.index + length) : undefined;
                            if (newValue != oldValue) {
                                logger.log(s.name);
                                oldpanelStatus[s.index] = new StatusActionResult({
                                    action: ActionType.read,
                                    index: s.index,
                                    data: newValue,
                                }).toString();
                            }
                            return;
                        }
                    }

                    s.fields.forEach((f, i) => {
                        const length = f.length || s.length;
                        const index = f.index || s.index + i * length;

                        const newValue = newDump.slice(index, index + length);
                        const oldValue = oldDump ? oldDump.slice(index, index + length) : undefined;

                        if (newValue != oldValue) {
                            logger.log(s.name);
                            oldpanelStatus[index] = new StatusActionResult({
                                action: ActionType.read,
                                index: index,
                                data: newValue,
                            }).toString();
                        }
                    });
                });
                this.statuses[panel.panelId].arr = values(oldpanelStatus);
                break;
            }
            case ActionType.readAll: {
                this.statuses[panel.panelId].arr.push(ActionType.readAll.toString().repeat(3));
                break;
            }
            case ActionType.writeAll: {
                this.statuses[panel.panelId].arr.push(ActionType.writeAll.toString().repeat(3));
                break;
            }
            case ActionType.idle: {
                this.statuses[panel.panelId].arr = [ActionType.idle.toString().repeat(3)];
            }
        }
    }

    async getPanel(id: string): Promise<Panel> {
        return this.panelRepo.findOne({ panelId: id });
    }
    async getDump(id: string): Promise<PanelDump> {
        return this.panelDumpRepo.findOne({ panelId: id });
    }

    startListenToPanels() {
        const port = 4000;
        const host = '0.0.0.0';
        const server = createServer();

        const listen = () => {
            server
                .listen(port, host, () => {
                    logger.log('TCP Server is running on port ' + port + '.');
                })
                .on('error', err => {
                    logger.log('error', err.message);
                });
        };
        const close = () => {
            server.close();
        };

        listen();
        server.on('error', err => {
            logger.error('Some problem, check error log!');
            // close();
            // listen();
        });
        server.on('end', err => {
            logger.log('END');
        });
        server.on('connection', sock => {
            logger.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
            const timeOut = setTimeout(() => {
                sock.end();
                logger.log('force close client connection!');
            }, TIMEOUT);
            sock.on('error', err => Logger.error(err.message));
            sock.on('data', async msg => {
                timeOut.refresh();
                try {
                    const msgString = msg.toString('utf8');
                    logger.log('DATA: ' + msgString);
                    const action: Action = JSON.parse(msgString);
                    const panel = await this.getDump(action.pId);
                    if (!panel) {
                        return sock.write('999');
                    }
                    let result;
                    switch (action.type) {
                        case ActionType.readAll:
                            return this.read(action, sock, 16);
                        case ActionType.read:
                            return this.read(action, sock, 1);
                        case ActionType.write:
                            return this.write(action, sock, 1);
                        case ActionType.writeAll:
                            return this.write(action, sock, 16);
                        case ActionType.status:
                            result = this.getStatus(action as any);
                    }
                    logger.log('return: ' + result);
                    return sock.write(result);
                } catch (e) {
                    logger.error(JSON.stringify(e));
                    // sock.end();
                }
            });

            sock.on('close', () => {
                clearTimeout(timeOut);
                logger.log('CLOSED: ' + sock.remoteAddress + ':' + sock.remotePort);
            });
        });
    }

    private sentMsg(pId, msg, type) {
        const sock = this.clientSockets[pId];
        if (!sock) {
            return;
        }
        try {
            sock.emit(type, msg);
        } catch (e) {
            console.log(e);
        }
    }
    private getStatus(action: Action & { d }) {
        const panelStatus = this.statuses[action.pId];
        if (!panelStatus) {
            return '000';
        }
        if (action.d) {
            this.sentMsg(action.pId, 'panel got - ' + JSON.stringify(panelStatus.arr.shift()), 'log');
        }
        if (!panelStatus.arr.length) {
            panelStatus.panel.actionType = ActionType.idle;
            Promise.all([this.saveDump(panelStatus.panel), this.panelRepo.saveOrUpdateOne(panelStatus.panel)]).then(_ => {
                this.sentMsg(action.pId, ActionType.idle, 'status');
                delete this.statuses[action.pId];
            });
            return '000';
        }
        this.sentMsg(action.pId, 'wait to panel for delivary - ' + JSON.stringify(panelStatus.arr), 'log');
        return panelStatus.arr[0];
    }

    async register(pId: string, uId: string, pType) {
        let panel = await this.panelRepo.findOne({ panelId: pId });
        if (panel) {
            throw 'panel already signed up';
        }

        panel = new Panels[pType + 'Panel']({
            name: '',
            address: '',
            panelId: pId,
            userId: uId,
        });
        return this.panelRepo.collection.insertOne(panel);
    }

    private async read(action: Action, sock: Socket, multiply = 1) {
        const dump = await this.getDump(action.pId);
        const start = action.data.start * multiply;
        const length = action.data.length * multiply;
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

        sock.write(saveResult.result.ok.toString().repeat(3));
    }

    private async saveDump(panel: Panel) {
        const dump = await this.panelDumpRepo.findOne({ panelId: panel.panelId });
        if (dump) {
            dump.dump = panel.dump();
        }
        return this.panelDumpRepo.saveOrUpdateOne(dump || { panelId: panel.panelId, dump: panel.dump() });
    }

    async addNewPanel(param: { panelId: string; type: PanelType; userId: any }): Promise<Panel> {
        const panel = new Panels[param.type + 'Panel'](param);
        panel.name = panel.panelId;
        panel._id = (await this.panelRepo.collection.insertOne(panel)).insertedId;
        await this.saveDump(panel);
        return panel;
    }
}
