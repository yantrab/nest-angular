import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AuthComponent } from './auth.component';
import { ComponentsModule } from 'src/components/components.modules'
import { RouterModule } from '@angular/router';
import {DynaFormBuilder} from 'src/dyna-form/dyna-form.builder'

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild([{ path: '', component: AuthComponent}])
  ],
  providers:[DynaFormBuilder]
})
export class AuthModule { }
