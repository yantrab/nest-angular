import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { App1Component } from './app1.component';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    App1Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: App1Component}])
  ],
})
export class App1Module { }
