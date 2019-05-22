import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
@WebSocketGateway()
export class TadorGateway {
    @WebSocketServer() server;
    @SubscribeMessage('testNumber')
    testNumber(client, data) {
        const result = data.replace('test', '').trim();
        Logger.log('testNumber:' + data + ':' + result);
        client.emit(result);
    }

    @SubscribeMessage('seq')
    seq(client, data: string) {
        const result = data.split('').map(n => {
            let num = +n + 1;
            if (num === 10) {
                num = 0;
            }
            return num;
        })
        .join('');
        Logger.log('seq:' + data + ':' + result);
        client.emit(result);
    }
}
