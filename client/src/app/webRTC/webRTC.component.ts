import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Socket } from 'ngx-socket-io';

@Component({
    selector: 'app2-root',
    template: `
        <video #remoteVideo id="remoteVideo" playsinline autoplay></video>
        <video
            #localVideo
            id="localVideo"
            [srcObject]="localStream"
            playsinline
            autoplay
            muted
        ></video>
        <div>
            <button (click)="start()">Start</button>
            <button (click)="call()">Call</button>
            <button (click)="hangup()">Hang Up</button>
        </div>
    `,
    styleUrls: ['webRTC.component.scss'],
})
export class WebRTCComponent implements OnInit {
    pc: RTCPeerConnection;
    localStream: MediaStream;
    remoteStream: MediaStream;
    senderId: string;
    constructor(private socket: Socket, private userService: AuthService) {}
    ngOnInit(): void {}
    hangup() {}
    call() {}
    async start() {
        try {
            this.senderId = (await this.userService.getUserAuthenticated())._id;
            await this.connectPeers();
            navigator.mediaDevices
                .getUserMedia({ audio: true, video: true })
                .then(localStream => {
                    this.localStream = localStream;
                    localStream
                        .getTracks()
                        .forEach(track => this.pc.addTrack(track, localStream));
                });
        } catch (error) {
            console.log(error);
        }
    }

    async connectPeers() {
        this.pc = new RTCPeerConnection();

        // Create the data channel and establish its event listeners
        const sendChannel = this.pc.createDataChannel('sendChannel');
        sendChannel.onopen = x => {
            console.log(x);
        };
        sendChannel.onclose = x => {
            console.log(x);
        };

        this.pc.onicecandidate = e =>
            !e.candidate ||
            this.emit('onicecandidate', { candidate: e.candidate });
        this.socket.fromEvent('onicecandidate').subscribe((data: any) => {
            return (
                data.senderId === this.senderId ||
                this.pc.addIceCandidate(data.candidate).catch(console.log)
            );
        });

        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);
        this.emit('offer', { desc: this.pc.localDescription });

        this.socket.fromEvent('offer').subscribe(
            (data: any) =>
                data.senderId === this.senderId ||
                this.pc
                    .setRemoteDescription(data.desc)
                    .then(async () => {
                        const answer = this.pc.createAnswer();
                        this.emit('answer', answer);
                    })
                    .catch(console.log)
        );

        this.socket
            .fromEvent('answer')
            .subscribe(
                (data: any) =>
                    data.senderId === this.senderId ||
                    this.pc.setRemoteDescription(data.answer)
            );
    }

    emit(msg, data) {
        this.socket.emit(msg, { senderId: this.senderId, data });
    }
}
