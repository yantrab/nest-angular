import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebRTCComponent } from './webRTC.component';
import { RouterModule } from '@angular/router';
import { WebRTCService } from './webRTC.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: '', options: {} };

@NgModule({
  declarations: [
    WebRTCComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: WebRTCComponent }]),
    SocketIoModule.forRoot(config)
  ],
  providers: [WebRTCService]
})
export class App2Module { }
