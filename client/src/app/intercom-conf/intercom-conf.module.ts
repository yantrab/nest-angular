import { NgModule } from '@angular/core';
//import { IntercomConfComponent } from './intercom-conf/intercom-conf.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../shared/components/components.module';
import { TadorController } from 'src/api/tador.controller';
@NgModule({
    // declarations: [IntercomConfComponent],
    imports: [
        ComponentsModule,
        RouterModule.forChild([
            {
                path: '',
               // component: IntercomConfComponent,
                // children: [
                //   { path: '', redirectTo: 'dumy' },
                //   { path: 'poly', component: PolyComponent },
                //   { path: 'dumy', component: DumyComponent },
                // ]
            },
        ]),
    ],
    providers: [TadorController, { provide: 'baseUrlI18n', useValue: '../../assets/i18n/login' }],
})
export class IntercomConfModule {}
