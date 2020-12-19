import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../shared/components/components.module';
import { TadorController } from 'src/api/tador.controller';
import { IntercomConfComponent } from './intercom-conf/intercom-conf.component';
import { ContactsComponent } from './intercom-conf/contacts/contacts.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { LogsComponent } from './intercom-conf/logs/logs.component';

//import { App, User } from 'shared/models';
//import { AdminModel } from '../admin/admin/admin.component';

// const model: AdminModel = {
//     userFormModel: {
//         feilds: [
//             { placeHolder: 'אמייל', key: 'email' },
//             { placeHolder: 'חברה', key: 'company' },
//             { placeHolder: 'שם פרטי', key: 'fName' },
//             { placeHolder: 'שם משפחה', key: 'lName' },
//             { placeHolder: 'טלפון', key: 'phone' },
//            // { placeHolder: 'קוד', key: 'code' },
//         ],
//         modelConstructor: User,
//         model: undefined,
//     },
//     app: App.tador,
// };

@NgModule({
    declarations: [IntercomConfComponent, ContactsComponent, LogsComponent],
    imports: [
        ComponentsModule,
        RouterModule.forChild([
            {
                path: '',
                component: IntercomConfComponent,
            },
            { path: 'admin', loadChildren: 'src/app/admin/admin.module#AdminModule' },
        ]),
    ],
    providers: [
        NgDialogAnimationService,
        TadorController,
        { provide: 'baseUrlI18n', useValue: '../../assets/i18n/login' },
        // { provide: 'userEditModel', useValue: model },
    ],
    entryComponents:[LogsComponent]
})
export class IntercomConfModule {}
