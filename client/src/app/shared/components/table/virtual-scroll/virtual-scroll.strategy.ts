import {
    CdkVirtualScrollViewport,
    VirtualScrollStrategy,
} from '@angular/cdk/scrolling';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export class GridTableVirtualScrollStrategy implements VirtualScrollStrategy {
    scrolledIndexChange: Observable<number>;

    private dataLength = 0;
    private readonly indexChange = new Subject<number>();
    private viewport: CdkVirtualScrollViewport;

    constructor(private itemHeight: number, private headerOffset: number) {
        this.scrolledIndexChange = this.indexChange.pipe(distinctUntilChanged());
    }

    attach(viewport: CdkVirtualScrollViewport): void {
        this.viewport = viewport;
        this.onDataLengthChanged();
    }

    onContentScrolled(): void {
        this.updateContent();
    }

    onDataLengthChanged(): void {
        if (this.viewport) {
            this.viewport.setTotalContentSize(this.dataLength * this.itemHeight);
            this.updateContent();
        }
    }

    setDataLength(length: number): void {
        this.dataLength = length;
        this.onDataLengthChanged();
    }

    setScrollHeight(rowHeight: number, headerOffset: number) {
        this.itemHeight = rowHeight;
        this.headerOffset = headerOffset;
        this.updateContent();
    }

    detach(): void { }
    onContentRendered(): void { }
    onRenderedOffsetChanged(): void { }
    scrollToIndex(index: number, behavior: ScrollBehavior): void { }

    private updateContent(): void {
        if (!this.viewport) {
            return;
        }

        const amount = Math.ceil(1000 / this.itemHeight);
        const offset = this.viewport.measureScrollOffset() - this.headerOffset;
        const buffer = Math.ceil(amount / 2);

        const skip = Math.round(offset / this.itemHeight);
        const index = Math.max(0, skip);
        const start = Math.max(0, index - buffer);
        const end = Math.min(this.dataLength, index + amount + buffer);

        this.viewport.setRenderedContentOffset(this.itemHeight * start);
        this.viewport.setRenderedRange({ start, end });

        this.indexChange.next(index);
    }
}
