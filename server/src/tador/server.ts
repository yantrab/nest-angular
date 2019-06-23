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
const port = 4000;
const host = '0.0.0.0';
let temp = '';
const server = createServer();

export class TadorPanelSocketManager {
    constructor() {

}
