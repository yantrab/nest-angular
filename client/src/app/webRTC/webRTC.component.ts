import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Socket } from 'ngx-socket-io';

@Component({
    selector: 'app2-root',
    template: ``,
    styleUrls: ['webRTC.component.scss'],
})
export class WebRTCComponent {
    constructor(private socket: Socket, private userService: AuthService) {
        setTimeout(() => {
            this.socket.on('testNumber', data => {
                console.log(data);
            });
            this.socket.emit('testNumber', 'test 123456', result => {
                console.log(result);
            });

            this.socket.on('seq', data => {
                console.log(data);
            });
            this.socket.emit('seq', '1234569', result => {
                console.log(result);
            });
        }, 1000);
    }
}
