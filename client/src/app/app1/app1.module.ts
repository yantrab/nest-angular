import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { App1Component } from './app1.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../shared/components/components.module';
import { PolyComponent } from './poly/poly.component';
import { DumyComponent } from './dumy/dumy.component';
import { App1Controller } from 'src/api/app1.controller';
import { FiltersComponent } from './poly/filters/filters.component';

@NgModule({
  declarations: [
    App1Component,
    PolyComponent,
    DumyComponent,
    FiltersComponent
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
  providers: [App1Controller]
})
export class App1Module { }
