import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { RouterModule } from '@angular/router';
import { DynaFormModule } from 'ng-dyna-form';
import { AuthController } from 'src/api/auth.controller';

@NgModule({
    declarations: [AuthComponent],
    imports: [
        CommonModule,
        ComponentsModule,
        RouterModule.forChild([{ path: '', component: AuthComponent }]),
        DynaFormModule,
    ],
    providers: [AuthController],
})
export class AuthModule {}
