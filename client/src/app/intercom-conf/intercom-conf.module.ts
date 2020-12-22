import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TadorController } from 'src/api/tador.controller';
import { IntercomConfComponent } from './intercom-conf/intercom-conf.component';
import { ContactsComponent } from './intercom-conf/contacts/contacts.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { LogsComponent } from './intercom-conf/logs/logs.component';
import { PanelsComponent } from './panels/panels.component';
import { ConfService } from './conf.service';
import { AppComponent } from './app.compnent';
import { ComponentsModule } from '../shared/components/components.module';
import { AdminComponent } from '../admin/admin/admin.component';
import { AdminController } from '../../api/admin.controller';
@NgModule({
    declarations: [IntercomConfComponent, ContactsComponent, LogsComponent, PanelsComponent, AppComponent, AdminComponent],
    imports: [
        ComponentsModule,
        RouterModule.forChild([
            { path: '', component: AppComponent, children: [
                { path: 'panels', component: PanelsComponent},
                { path: 'edit/:id', component: IntercomConfComponent},
                // { path: 'admin', loadChildren: 'src/app/admin/admin.module#AdminModule' },
                    { path: 'admin', component: AdminComponent},

                    { path: '', redirectTo: 'panels', pathMatch: 'full' }
                ]
            },

        ]),
    ],
    providers: [
        AdminController,
        NgDialogAnimationService,
        TadorController,
        ConfService,
        { provide: 'baseUrlI18n', useValue: '../../assets/i18n/login' },
    ],
    entryComponents: [LogsComponent]
})
export class IntercomConfModule {}
