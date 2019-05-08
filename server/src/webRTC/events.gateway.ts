import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer() server;

  @SubscribeMessage('onicecandidate')
  onicecandidate(client, data) {
    this.server.emit('onicecandidate', data);
  }

  @SubscribeMessage('offer')
  offer(client, data) {
    this.server.emit('offer', data);
  }

  @SubscribeMessage('answer')
  async answer(client, data) {
    this.server.emit('offer', data);
  }
}
