import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GridTableDataSource } from './virtual-scroll/data-source';
import { MatSort } from '@angular/material';
import { ColumnDef } from './table.interfaces';
@Component({
  selector: 'p-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> implements OnInit, AfterViewInit {
  pending: boolean;
  sticky = false;
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: GridTableDataSource<T>;
  offset: Observable<number>;
  @Input() columnsDef: ColumnDef[];
  @Input() rows: any[];
  columns: string[];
  page = 1;
  pageSize = 80;

  constructor() {
  }

  ngOnInit() {
    this.init();
    this.dataSource.allData = this.rows;//.slice(0, this.pageSize);
    this.columns = this.columnsDef.map(c => c.field);
  }
  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the the top.
    this.sort.sortChange.subscribe(() => {
      // this.dataSource.allData = this.rows.so
      console.log(this.sort);
    });
  }
  private init() {
    if (this.dataSource) {
      return;
    }
    this.dataSource = new GridTableDataSource([], {
      viewport: this.viewport,
    });
    this.offset = this.viewport.renderedRangeStream.pipe(
      map(() => -this.viewport.getOffsetToRenderedContentStart())
    );
  }
  nextBatch(event) {
    if (!this.sticky) { this.sticky = true; }
    return;
    const buffer = 20;
    const range = this.viewport.getRenderedRange();
    const end = range.end;
    if (this.dataSource.allData && this.dataSource.allData.length > 0) {
      if (end + buffer > this.page * this.pageSize) {
        this.page++;
        this.pending = true;
        setTimeout(() => {
          this.dataSource.allData = this.rows.slice(0, this.page * this.pageSize);
          this.pending = false;
        }, 250);
      }
    }
  }
}
