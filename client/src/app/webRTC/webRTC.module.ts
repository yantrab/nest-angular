import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebRTCComponent } from './webRTC.component';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    WebRTCComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: WebRTCComponent}])
  ],
})
export class App2Module { }
