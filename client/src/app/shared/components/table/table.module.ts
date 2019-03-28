import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { GridTableVirtualScrollModule } from './virtual-scroll/virtual-scroll.module';
import { TableComponent, PCellDef } from './table.component';
import { CommonModule } from '@angular/common';
import {MaterialModule} from '../material/material.module'
const components = [TableComponent, PCellDef];

@NgModule({
  declarations: components,
  exports: components,
  imports: [
    CommonModule,
    GridTableVirtualScrollModule,
    ScrollingModule,
    MaterialModule
  ],
})
export class TableModule { }

