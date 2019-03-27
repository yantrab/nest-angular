import { NgModule } from '@angular/core';
import { GridTableFixedVirtualScrollDirective } from './virtual-scroll.directive';

const components = [GridTableFixedVirtualScrollDirective];

@NgModule({
  declarations: components,
  exports: components,
})
export class GridTableVirtualScrollModule {}