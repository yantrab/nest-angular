import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Socket } from 'ngx-socket-io';

@Component({
    selector: 'app2-root',
    template: `
        <video #remoteVideo id="remoteVideo" playsinline autoplay></video>
        <video #localVideo id="localVideo" [srcObject]="localStream" playsinline autoplay muted></video>
        <div>
            <button (click)="start()">Start</button>
            <button (click)="call()">Call</button>
            <button (click)="hangup()">Hang Up</button>
        </div>
    `,
    styleUrls: ['webRTC.component.scss'],
})
export class WebRTCComponent {
    constructor(private socket: Socket, private userService: AuthService) {
        setTimeout(() => {
            this.socket.on('testNumber', data => {
                console.log(data);
            });
            this.socket.emit('testNumber', 'test 3', result =>{
                console.log(result);
            });
        },1000);
    }
}
