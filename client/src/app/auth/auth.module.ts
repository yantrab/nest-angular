import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { RouterModule } from '@angular/router';
import { DynaFormModule } from 'ng-dyna-form';
import { AuthController } from 'src/api/auth.controller';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
    declarations: [AuthComponent],
    imports: [
        CommonModule,
        ComponentsModule,
        RouterModule.forChild([
            { path: ':state/:token', component: AuthComponent },
            { path: ':state', component: AuthComponent },
        ]),
        DynaFormModule,
        AngularSvgIconModule,
    ],
    providers: [AuthController, { provide: 'baseUrlI18n', useValue: '../../assets/i18n/login' }],
})
export class AuthModule {}
