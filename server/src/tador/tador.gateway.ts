import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
@WebSocketGateway()
export class TadorGateway {
    @WebSocketServer() server;
    @SubscribeMessage('testNumber')
    testNumber(client, data) {
        client.emit(data.replace('test', '').trim());
    }
}
