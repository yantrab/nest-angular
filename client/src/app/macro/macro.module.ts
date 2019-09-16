import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../shared/components/components.module';
import { MacroController } from 'src/api/macro.controller';
import { MacroComponent } from './macro.component';

@NgModule({
    declarations: [MacroComponent],
    imports: [
        ComponentsModule,
        RouterModule.forChild([
            {
                path: '',
                component: MacroComponent,
            },
        ]),
    ],
    providers: [MacroController, { provide: 'baseUrlI18n', useValue: '../../assets/i18n/login' }],
})
export class MacroModule {}
