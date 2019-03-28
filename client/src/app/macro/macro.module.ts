import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../shared/components/components.module';
import { MacroController } from 'src/api/macro.controller';
import { MacroComponent } from './macro.component';
@NgModule({
  declarations: [
    MacroComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(
      [
        {
          path: '', component: MacroComponent,
        },
      ])
  ],
  providers: [MacroController]
})
export class MacroModule { }
