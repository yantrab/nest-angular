import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app2-root',
  template: `
  <video #remoteVideo id="remoteVideo"  playsinline autoplay></video>
  <video #localVideo  id="localVideo" [srcObject]="localStream" playsinline autoplay muted></video>
  <div>
        <button (click)="start()">Start</button>
        <button (click)="call()">Call</button>
        <button (click)="hangup()">Hang Up</button>
  </div>
  `,
  styleUrls: ['webRTC.component.scss']
})
export class WebRTCComponent implements OnInit {
  localStream: MediaStream;
  ngOnInit(): void {
    this.streamLocal();
  }
  hangup() { }
  call() { }
  start() { }
  async streamLocal() {
    this.localStream = await
      navigator.mediaDevices.getUserMedia({
        audio: true, video: true
      });
  }


}
