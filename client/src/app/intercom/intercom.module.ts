import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { IntercomComponent } from './intercom.component';
import { ComponentsModule } from '../shared/components/components.module';
// const config: SocketIoConfig = { url: '', options: {} };

@NgModule({
    declarations: [IntercomComponent],
    imports: [
        CommonModule,
        ComponentsModule,
        RouterModule.forChild([{ path: '', component: IntercomComponent }]),
        // SocketIoModule.forRoot(config)
    ],
})
export class IntercomModule {}
