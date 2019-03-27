import {
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GridTableDataSource } from './virtual-scroll/data-source';
import { MatSort } from '@angular/material';
@Component({
  selector: 'p-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> implements OnInit {
  pending: boolean;
  sticky = false;
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: GridTableDataSource<T>;
  displayedColumns: string[];
  offset: Observable<number>;
  visibleColumns: any[];
  @Input() _alldata: any[];

  page = 1;
  pageSize = 80;

  constructor() {
    this.visibleColumns = [{
      field: '_id'
    }, {
      field: 'name'
    }];
    this.displayedColumns = this.visibleColumns.map(column => column.field);
  }

  ngOnInit() {
    this.init();
    this.dataSource.allData = this._alldata.slice(0, this.pageSize);

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
    const buffer = 20;
    const range = this.viewport.getRenderedRange();
    const end = range.end;
    if (this.dataSource.allData && this.dataSource.allData.length > 0) {
      if (end + buffer > this.page * this.pageSize) {
        this.page++;
        this.pending = true;
        setTimeout(() => {
          this.dataSource.allData = this._alldata.slice(0, this.page * this.pageSize);
          this.pending = false;
        }, 250);
      }
    }
  }
}