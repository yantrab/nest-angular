import { Component, ElementRef, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { I18nService } from '../../services/i18n.service';
import { sum } from 'lodash';

@Component({
    selector: 'p-multi-slider-range-selector',
    templateUrl: './multi-slider-range-selector.component.html',
    styleUrls: ['./multi-slider-range-selector.component.scss'],
})
export class MultiSliderRangeSelectorComponent implements OnInit {
    @Input() group;
    @Input() color;
    private totalWidth: any;
    constructor(private i18Service: I18nService) {}

    ngOnInit() {}
    private getTargetX(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        return e.clientX - rect.left;
    }
    _headerCells: ElementRef[];
    @ViewChildren('headercell') set headerCells(cells) {
        this._headerCells = cells.toArray();
        setTimeout(() => {
            this.totalWidth = sum(this._headerCells.map(c => c.nativeElement.clientWidth));
        });
    }
    isResizeActive = false;
    inMove: boolean;
    resizeTable(event, i) {
        const cells = this._headerCells;
        const elNextIndex = i + 1;
        if (this.inMove || !cells[elNextIndex] || !this.isResizeActive) {
            return;
        }
        this.inMove = true;
        const el = cells[i].nativeElement;
        const elStartWidth = el.clientWidth;
        const startX = event.pageX;
        const dir = this.i18Service.dir === 'ltr' ? 1 : -1;
        const elNextStartWidth = cells[elNextIndex].nativeElement.clientWidth;
        const moveFn = (ev: any) => {
            const offset = (ev.pageX - startX) * dir;
            if (elStartWidth + offset < 0 || elNextStartWidth - offset < 0) {
                return;
            }
            this.group[i].percent = ((elStartWidth + offset) / this.totalWidth) * 100;

            this.group[elNextIndex].percent = ((elNextStartWidth - offset) / this.totalWidth) * 100;
        };
        const upFn = () => {
            document.removeEventListener('mousemove', moveFn);
            document.removeEventListener('mouseup', upFn);
            this.inMove = false;
        };
        document.addEventListener('mousemove', moveFn);
        document.addEventListener('mouseup', upFn);
    }

    mousemove(ev, i) {
        if (this.inMove) {
            return;
        }
        this.isResizeActive = false;
        const el = ev.currentTarget;
        const elWidth = el.clientWidth;
        let x = this.getTargetX(ev);
        if (this.i18Service.dir === 'rtl') {
            x = elWidth - x;
        }
        if (elWidth - x < 10) {
            this.isResizeActive = true;
        }
    }
}
