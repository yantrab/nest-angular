import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { RouterModule } from '@angular/router';
import { DynaFormBuilder } from 'src/dyna-form/dyna-form.builder';
import { AuthController } from 'src/api/auth.controller';
import { I18nService } from '../shared/services/i18n.service';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild([{ path: '', component: AuthComponent }])
  ],
  providers: [DynaFormBuilder, AuthController, I18nService, { provide: 'baseUrlI18n', useValue: '../../assets/i18n/login' }]
})
export class AuthModule { }
