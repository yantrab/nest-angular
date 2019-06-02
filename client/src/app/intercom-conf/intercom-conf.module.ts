import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../shared/components/components.module';
import { TadorController } from 'src/api/tador.controller';
import { IntercomConfComponent } from './intercom-conf/intercom-conf.component';
import { ContactsComponent } from './intercom-conf/contacts/contacts.component';

@NgModule({
    declarations: [
        IntercomConfComponent,
        ContactsComponent
    ],
    imports: [
        ComponentsModule,
        RouterModule.forChild([
            {
                path: '',
                component: IntercomConfComponent,
            },
        ]),
    ],
    providers: [TadorController, { provide: 'baseUrlI18n', useValue: '../../assets/i18n/login' }],
})
export class IntercomConfModule {}
