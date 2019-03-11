import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { App1Component } from './app1.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../shared/components/components.module';
import { PolyComponent } from './poly/poly.component';
import { DumyComponent } from './dumy/dumy.component';
@NgModule({
  declarations: [
    App1Component,
    PolyComponent,
    DumyComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(
      [
        {
          path: '', component: App1Component,
          children: [
            { path: '', redirectTo: 'dumy' },
            { path: 'poly', component: PolyComponent },
            { path: 'dumy', component: DumyComponent },
          ]
        },
      ])
  ],
})
export class App1Module { }
