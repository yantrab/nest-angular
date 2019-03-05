import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class WebRTCService {

    constructor(private socket: Socket) {
        this.getMessage();
    }

    sendStream(stream) {
        this.socket.emit('stream', stream);
    }

    getMessage() {
        return this.socket
            .fromEvent('stream').subscribe(data => console.log(data));
    }
}