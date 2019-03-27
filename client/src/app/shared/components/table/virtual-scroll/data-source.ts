import { DataSource, ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, shareReplay, startWith } from 'rxjs/operators';

export class GridTableDataSource<T> extends DataSource<T> {
  readonly queryData: Observable<T[]>;
  private readonly _queryData = new BehaviorSubject<T[]>([]);
  private readonly visibleData: Observable<any[]>;
  private _data: T[];

  get allData(): T[] {
    return this._data.slice();
  }
  set allData(data: T[]) {
    this._data = data;
    this._queryData.next(data);
  }
  get data(): T[] {
    let data: T[];
    this.visibleData.subscribe(d => (data = d)).unsubscribe();
    return data;
  }
  constructor(
    initialData: T[],
    { viewport }: { viewport?: CdkVirtualScrollViewport } = {}
  ) {
    super();
    this._data = initialData;
    this.queryData = this._queryData.asObservable();
    this._queryData.next(initialData);
    const sliced = combineLatest(
      this._queryData,
      viewport.renderedRangeStream.pipe(startWith({} as ListRange))
    ).pipe(
      map(([data, { start, end }]) =>
        start == null || end == null ? data : data.slice(start, end)
      )
    );
    this.visibleData = sliced.pipe(shareReplay(1));
  }
  connect() {
    return this.visibleData;
  }
  disconnect() { }
}