import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { App2Component } from './app1.component';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    App2Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: App2Component}])
  ],
})
export class App2Module { }
