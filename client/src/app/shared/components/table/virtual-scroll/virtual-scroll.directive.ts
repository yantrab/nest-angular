import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ContentChild,
  Directive,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { MatTable } from '@angular/material';
import { Subscription } from 'rxjs';
import { GridTableDataSource } from './data-source';
import { GridTableVirtualScrollStrategy } from './virtual-scroll.strategy';

@Directive({
  selector: 'cdk-virtual-scroll-viewport[gridTableVirtualScroll]',
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useFactory: (scroll: GridTableFixedVirtualScrollDirective) => scroll.scrollStrategy,
      deps: [forwardRef(() => GridTableFixedVirtualScrollDirective)],
    },
  ],
})
export class GridTableFixedVirtualScrollDirective
  implements AfterViewInit, OnChanges, OnDestroy {
  @Input() rowHeight = 48;
  @Input() offset = 56;

  @ContentChild(MatTable) table: MatTable<any>;

  scrollStrategy: GridTableVirtualScrollStrategy;

  private sub: Subscription;

  constructor() {
    this.scrollStrategy = new GridTableVirtualScrollStrategy(
      this.rowHeight,
      this.offset
    );
  }

  ngAfterViewInit() {
    if (this.table.dataSource instanceof GridTableDataSource) {
      this.sub = this.table.dataSource.queryData.subscribe(data => {
        this.scrollStrategy.setDataLength(data.length);
      });
    }
  }

  ngOnChanges() {
    this.scrollStrategy.setScrollHeight(this.rowHeight, this.offset);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
