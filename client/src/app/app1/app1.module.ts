import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { App1Component } from './app1.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../shared/components/components.module';
@NgModule({
  declarations: [
    App1Component
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild([{ path: '', component: App1Component}])
  ],
})
export class App1Module { }
