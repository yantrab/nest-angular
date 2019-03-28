import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Directive,
  TemplateRef,
  ContentChildren,
  QueryList,
} from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { Observable, fromEvent, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { GridTableDataSource } from './virtual-scroll/data-source';
import { MatSort } from '@angular/material';
import { ColumnDef } from './table.interfaces';
import { orderBy } from 'shared';

@Directive({ selector: '[pCellDef]' })
export class PCellDef {
    constructor(public template: TemplateRef<any>) { }
    /** Unique name for this column. */
    @Input('column')
    get columnName(): string { return this._columnName; }
    set columnName(name: string) {
        this._columnName = name;
    }
    private _columnName: string;
}


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
  @ViewChild('filter') filter: ElementRef;
  @ContentChildren(PCellDef) _CellDefs: QueryList<PCellDef>;
  filterChange = new BehaviorSubject('');
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
    this.dataSource.allData = this.rows.slice(0, this.pageSize);
    this.columns = this.columnsDef.map(c => c.field);
  }
  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the the top.
    this.sort.sortChange.subscribe(() => {
      this.dataSource.allData = orderBy(this.rows, this.sort.active, this.sort.direction as any);
    });

    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(distinctUntilChanged(), debounceTime(150))
      .subscribe(() => {
        this.pending = true;
        this.dataSource.allData =
          this.rows.filter(row => Object.keys(row).
            some(key => typeof (row[key]) === "string"
              && (row[key] as string).startsWith(this.filter.nativeElement.value)));
        this.pending = false;
      });

      this._CellDefs.forEach(columnDef => {
        this.columnsDef.find(c => c.field === columnDef.columnName).template = columnDef.template;
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
