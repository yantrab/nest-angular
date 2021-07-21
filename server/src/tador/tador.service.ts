import { Injectable, Logger } from '@nestjs/common';
import { Repository, RepositoryFactory } from 'mongo-nest';
import * as Panels from 'shared/models/tador/panels';
import { ContactNameDirection, Panel, Source } from 'shared/models/tador/panels';
import { createServer, Socket } from 'net';
import { ActionType, PanelType } from 'shared/models/tador/enum';
import { Entity } from 'shared/models';
import { keyBy, values } from 'lodash';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { dumps } from './initial_daumps';
import { AddPanelRequest } from 'shared/models/tador/add-panel-request';

class PanelDump extends Entity {
    dump: string;
    panelId: string;
}

const replaceByIndex = (s, start, substitute) => {
    return s.substring(0, start) + substitute + s.substring(start + substitute.length);
};

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
    async onRegister(sock, pId) {
        this.clientSockets[pId] = sock;
    }

    @SubscribeMessage('unregister')
    async onUnRegister(sock, message) {
        const pId = message;
        delete this.clientSockets[pId];
    }

    clientSockets: { [pId: string]: Socket } = {};
    panelRepo: Repository<Panel>;
    panelDumpRepo: Repository<PanelDump>;

    constructor(private repositoryFactory: RepositoryFactory) {
        this.panelRepo = this.repositoryFactory.getRepository<Panel>(Panel, 'tador');
        this.panelDumpRepo = this.repositoryFactory.getRepository<PanelDump>(PanelDump, 'tador');
        this.startListen();
    }

    statuses: {
        [id: string]: {
            panel: Panel;
            oldDump: string;
            arr: { actionType?: ActionType, action: string; location?: { index: number; field: string; dumpIndex: number; value: string } }[];
            lastSentAction?: ActionType;
        };
    } = {};

    canceleds: { [id: string]: string[] } = {};

    async updatePanel(panel: Panel) {
        logger.log('save panel ' + panel.panelId);
        const oldDump = (await this.getDump(panel.panelId)).dump;
        const newDump = panel.dump();
        this.signChanges(panel, oldDump, newDump, Source.client);
        await this.panelRepo.saveOrUpdateOne(panel);
        return panel;
    }

    signChanges(panel: Panel, oldDump: string, newDump: string, source: Source, initialChangesList = []) {
        panel.contacts.changesList = initialChangesList;
        panel.contacts.contactFields.forEach(field => {
            const fieldLength = field.length;
            const index = field.index;
            for (let i = 0; i < panel.contacts.count; i++) {
                const start = index + fieldLength * i;
                const oldValue = oldDump ? oldDump.slice(start, start + fieldLength) : undefined;
                const newValue = newDump.slice(start, start + fieldLength);
                if (oldValue != newValue) {
                    panel.contacts.changesList[i] = panel.contacts.changesList[i] || {};
                    panel.contacts.changesList[i][field.property] = source;
                }
            }
        });
    }

    async addStatus(panel: Panel, type: ActionType) {
        this.updatePanel(panel);
        logger.log('add status: ' + type);
        if (type === ActionType.idle) {
            if (!this.statuses[panel.panelId]) return
            const lastSentAction = this.statuses[panel.panelId].lastSentAction || ActionType.idle;
            const actionType = this.statuses[panel.panelId].panel.actionType;
            delete this.statuses[panel.panelId]
            delete this.canceleds[panel.panelId]
            if (lastSentAction === ActionType.idle) return;
            this.canceleds[panel.panelId] = this.canceleds[panel.panelId] || [];

            switch (actionType) {
                case ActionType.readAllProgress: {
                    this.canceleds[panel.panelId].push('RRR');
                    break;
                }
                case ActionType.writeAllProgress: {
                    this.canceleds[panel.panelId].push('SSS');
                    break;
                }
                case ActionType.nameOrder: {
                    this.canceleds[panel.panelId].push('TTT');
                    break;
                }
                case ActionType.powerUp: {
                    this.canceleds[panel.panelId].push('808');
                    break;
                }
            }

            return ;
        }

        this.statuses[panel.panelId] = { panel, arr: [], oldDump: (await this.getDump(panel.panelId)).dump };
        switch (type) {
            case ActionType.read: {
                const oldpanelStatus: any = keyBy(this.statuses[panel.panelId].arr, 'action.index');
                const oldDump = this.statuses[panel.panelId].oldDump;
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
                            oldpanelStatus[start] = {
                                action: new StatusActionResult({
                                    action: ActionType.read,
                                    index: start,
                                    data: newValue,
                                }).toString(),
                                location: { index: i, field: field.property, dumpIndex: start, value: newValue },
                            };
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

                                oldpanelStatus[s.index] = {
                                    action: new StatusActionResult({
                                        action: ActionType.read,
                                        index: s.index,
                                        data: newValue,
                                    }).toString(),
                                    location: {},
                                };
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
                            logger.log('change - ' + s.name + ' - ' + f.name);
                            oldpanelStatus[index] = {
                                action: new StatusActionResult({
                                    action: ActionType.read,
                                    index: index,
                                    data: newValue,
                                }).toString(),
                                location: {},
                            };
                        }
                    });
                });
                this.statuses[panel.panelId].arr = values(oldpanelStatus);
                logger.log(this.statuses[panel.panelId].arr);
                if (!this.statuses[panel.panelId].arr.length) {
                    delete this.statuses[panel.panelId];
                    setTimeout(() => this.sentMsg(panel.panelId, ActionType.idle, 'status'), 1000);
                }

                break;
            }
            case ActionType.readAll:
                await this.saveDump(panel);
            case ActionType.nameOrder:
            case ActionType.powerUp:
            case ActionType.writeAll: {
                this.statuses[panel.panelId].arr.push({actionType:type, action: type.toString().repeat(3) });
                break;
            }
        }
    }

    async getPanel(panelId: string): Promise<Panel> {
        const panel = await this.panelRepo.findOne({ panelId });
        if (!panel) {return panel}
        if (!this.statuses[panel.panelId]) {
            panel.actionType = ActionType.idle;
        }
        return panel;
    }

    async getDump(id: string): Promise<PanelDump> {
        return this.panelDumpRepo.findOne({ panelId: id });
    }

    startListen() {
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

        listen();
        server.on('error', err => {
            logger.error('Some problem, check error log!');
        });
        server.on('end', err => {
            // logger.log('END');
        });
        server.on('connection', sock => {
            // logger.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
            const timeOut = setTimeout(() => {
                sock.end();
                //logger.log('force close client connection!');
            }, TIMEOUT);
            sock.on('error', err => Logger.error(err.message));
            sock.on('data', async msg => {
                timeOut.refresh();
                let action: Action;
                try {
                    //logger.log('DATA 1: ' + JSON.stringify(msg));
                    for (let i = 0; i < msg.length; i++) {
                        if (msg[i] < 187 && msg[i] > 159) {
                            msg = Buffer.concat([msg.slice(0, i), new Buffer([215, msg[i] - 16]), msg.slice(i + 1, msg.length + 1)]);
                            i++;
                        }
                    }
                    //logger.log('DATA 2: ' + JSON.stringify(msg));

                    const msgString = msg.toString('utf8');
                    //logger.log('DATA: ' + msgString);

                    if (msgString[0] !== '!') {
                        try {
                            action = JSON.parse(msgString);
                            this.sentMsg(action.pId, "", 'pingg')
                        } catch (e) {
                            sock.end();
                        }
                    } else
                        action = {
                            pId: msgString.slice(1, 16),
                            type: ActionType.write,
                            data: { start: +msgString.slice(16, 21), data: msgString.slice(24) },
                        };
                    logger.log('Action:' + JSON.stringify(action));
                    const panel = await this.getDump(action.pId);
                    if (!panel) {
                        return sock.write('999');
                    }
                    let result;
                    switch (action.type) {
                        case ActionType.readAll:
                            result = await this.read(action, sock, 16);
                            break;
                        case ActionType.read:
                            result = await this.read(action, sock, 1);
                            break;
                        case ActionType.write:
                            result = await this.write(action, sock, 1);
                            break;
                        case ActionType.writeAll:
                            result = await this.write(action, sock, 16);
                            break;
                        case ActionType.status:
                            result = await this.getStatus(action as any);
                            break;
                    }

                    logger.log('return: ' + result);
                    this.sentMsg(action.pId, { type:ActionType[action.type], result,  msg: JSON.stringify(action.data)}, 'log')
                    // logger.log('return length: ' + result.length);
                    let buffer = Buffer.from(result, 'utf8');
                    for (let i = 0; i < buffer.length; i++) {
                        if (buffer[i] < 171 && buffer[i] > 143) {
                            buffer = Buffer.concat([buffer.slice(0, i - 1), new Buffer([buffer[i] + 16]), buffer.slice(i + 1, buffer.length + 1)]);
                        }
                    }

                    return sock.write(buffer);
                } catch (e) {
                    this.sentMsg(action.pId, {from: 'server', e}, 'log')
                    logger.error(e);
                    sock.write('100');
                    sock.end();
                }
            });

            sock.on('close', () => {
                clearTimeout(timeOut);
                // logger.log('CLOSED: ' + sock.remoteAddress + ':' + sock.remotePort);
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
            logger.log(e);
        }
    }

    private async getStatus(action: Action & { d }): Promise<string> {
        const panelCaneled = this.canceleds[action.pId];
        if (panelCaneled) {
            const result = panelCaneled[0];
            if (!action.d) return  result;
            if (action.d) {
                panelCaneled.shift();
                if (panelCaneled.length === 0) {
                    delete this.canceleds[action.pId];
                }
                else
                    return panelCaneled[0]
            }
        }

        const panelStatus = this.statuses[action.pId];
        if (!panelStatus || !panelStatus.arr || !panelStatus.arr.length) {
            return '000';
        }

        if (!action.d) {
            const toSent = panelStatus.arr[0];
            if (toSent.location && toSent.location.dumpIndex) {
                panelStatus.panel.contacts.changesList[toSent.location.index][toSent.location.field] = Source.PanelProgress;
                this.sentMsg(action.pId, toSent.location, 'sent-progress');
                await this.panelRepo.saveOrUpdateOne(panelStatus.panel);
            }
            panelStatus.lastSentAction = toSent.actionType;
            return toSent.action;
        }

        let result = '000';
        const sendedItem = panelStatus.arr.shift();

        if (sendedItem.location && sendedItem.location.dumpIndex) {
            this.sentMsg(action.pId, sendedItem.location, 'sent');
            panelStatus.oldDump = replaceByIndex(panelStatus.oldDump, sendedItem.location.dumpIndex, sendedItem.location.value);
            await this.panelDumpRepo.collection.updateOne({ panelId: action.pId }, { $set: { dump: panelStatus.oldDump } });
        }

        if (sendedItem.actionType == ActionType.read || sendedItem.actionType == ActionType.readAll) {
            result = 'RRR'
        }

        if (sendedItem.actionType == ActionType.write || sendedItem.actionType == ActionType.writeAll) {
            result = 'SSS'
        }

        if (!panelStatus.arr.length) {
            panelStatus.panel.actionType = ActionType.idle;
            delete this.statuses[action.pId];
            this.sentMsg(action.pId, ActionType.idle, 'status');
        } else {
            result = panelStatus.arr[0].action;
            if (
                panelStatus.panel.contacts.changesList &&
                panelStatus.panel.contacts.changesList[panelStatus.arr[0].location.index]
            )
                panelStatus.panel.contacts.changesList[panelStatus.arr[0].location.index][panelStatus.arr[0].location.field] =
                    Source.PanelProgress;
            this.sentMsg(action.pId, panelStatus.arr[0].location, 'sent-progress');
        }




        if (sendedItem.location && sendedItem.location.dumpIndex)
            delete panelStatus.panel.contacts.changesList[sendedItem.location.index][sendedItem.location.field];
        await this.panelRepo.saveOrUpdateOne(panelStatus.panel);

        return result;
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
        if (!this.statuses[action.pId]) {
            this.sentMsg(action.pId, ActionType.idle, 'status');
            return 'RRR';
        }

        const panel = this.statuses[action.pId].panel;
        if (panel.actionType !== ActionType.readProgress && panel.actionType !== ActionType.readAllProgress) {
            panel.actionType = panel.actionType === ActionType.read ? ActionType.readProgress : ActionType.readAllProgress;
            this.sentMsg(action.pId, panel.actionType, 'status');

            await this.updatePanel(panel);
        }

        const dump = await this.getDump(action.pId);
        const start = action.data.start * multiply;
        const length = action.data.length * multiply;
        return 'S' + dump.dump.slice(start, start + length);
    }

    private async write(action: Action, sock: Socket, multiply = 1) {
        if (!this.statuses[action.pId]) {
            this.sentMsg(action.pId, ActionType.idle, 'status');
            return 'SSS';
        }
        action.data.start = +action.data.start;
        let panel = this.statuses[action.pId].panel;
        if (panel.actionType !== ActionType.writeProgress && panel.actionType !== ActionType.writeAllProgress) {
            panel.actionType = panel.actionType === ActionType.write ? ActionType.writeProgress : ActionType.writeAllProgress;
            this.sentMsg(action.pId, panel.actionType, 'status');
            await this.updatePanel(panel);
        }
        let dump = panel.dump().split('');
        const start = action.data.start * multiply;
        const length = action.data.data.length;
        const oldDump = panel.dump();
        for (let i = start; i < start + length; i++) {
            dump[i] = '^';
        }
        this.signChanges(panel, oldDump, dump.join(''), Source.Panel, panel.contacts.changesList);
        for (let i = start; i < start + length; i++) {
            const value = action.data.data[i - start];
            if (value === String.fromCharCode(0)){
                for (let j = i; j < start + length; j++) {
                    dump[j] = ' ';
                }
                break;
            }
            dump[i] = value;
        }
        panel.reDump(dump.join(''));
        const saveResult = await this.panelRepo.saveOrUpdateOne(panel);
        await this.saveDump(panel);
        this.sentMsg(action.pId, '', 'write');

        return saveResult.result.ok.toString().repeat(3);
    }

    private async saveDump(panel: Panel) {
        const dump = await this.panelDumpRepo.findOne({ panelId: panel.panelId });
        if (dump) {
            dump.dump = panel.dump();
        }
        return this.panelDumpRepo.saveOrUpdateOne(dump || { panelId: panel.panelId, dump: panel.dump() });
    }

    async addNewPanel(param: AddPanelRequest): Promise<Panel> {
        delete param.id
        const panel: Panel = new Panels['MPPanel'](param as any);
        panel.reDump(dumps['MP'][param.direction])
        panel.name = panel.panelId;
        panel._id = (await this.panelRepo.collection.insertOne(panel)).insertedId;
        await this.saveDump(panel);
        return panel;
    }
}
