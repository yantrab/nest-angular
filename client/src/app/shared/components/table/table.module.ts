import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  MatCheckboxModule,
  MatProgressBarModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { GridTableVirtualScrollModule } from './virtual-scroll/virtual-scroll.module';
import { TableComponent } from './table.component';
import { CommonModule } from '@angular/common';

const components = [TableComponent];

@NgModule({
  declarations: components,
  exports: components,
  imports: [
    CommonModule,
    GridTableVirtualScrollModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatSortModule,
    MatTableModule,
    ScrollingModule
  ],
})
export class TableModule { }
