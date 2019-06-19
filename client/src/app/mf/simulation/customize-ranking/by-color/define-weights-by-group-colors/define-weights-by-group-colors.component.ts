import { Component, ElementRef, Input, ViewChild, ViewChildren } from '@angular/core';
import { CustomizeParameterGroup } from 'shared/models';
import { I18nService } from 'src/app/shared/services/i18n.service';
@Component({
    selector: 'p-define-weights-by-group-colors',
    templateUrl: './define-weights-by-group-colors.component.html',
    styleUrls: ['./define-weights-by-group-colors.component.scss'],
})
export class DefineWeightsByGroupColorsComponent {
    constructor(private i18Service: I18nService) {}
    selectedGroup: CustomizeParameterGroup;
    @Input() groups: { color: string; parameterGroups: CustomizeParameterGroup[] };
    private inMove: boolean;
    ngOnInit() {
        this.selectedGroup = this.groups.parameterGroups[0];
    }
    ngAfterViewInit() {
        const totalWidth = this.container.nativeElement.clienWidth;
        setTimeout(
            () =>
                this.groups.parameterGroups.forEach(g => {
                    g.width = (totalWidth * g.percent) / 100 + 'px';
                }),
            100,
        );
    }

    private getTargetX(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        return e.clientX - rect.left;
    }
    _headerCells: ElementRef[];
    @ViewChildren('headercell') set headerCells(cells) {
        this._headerCells = cells.toArray();
    }
    isResizeActive = false;
    @ViewChild('container', null) container: ElementRef;
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
            this.groups.parameterGroups[i].percent = ((elStartWidth + offset) / this.container.nativeElement.clientWidth) * 100;

            this.groups.parameterGroups[elNextIndex].percent =
                ((elNextStartWidth - offset) / this.container.nativeElement.clientWidth) * 100;
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

    // slideChange(value: number, i: number) {
    //     const prev = this.groups.parameterGroups[i].percent;
    //     this.groups.parameterGroups[i].percent = value;
    //     this.groups.parameterGroups[i + 1].percent += prev - value;
    // }
    resetPercent(group: CustomizeParameterGroup) {
        const percent = 100 / group.activeParameters.length;
        group.activeParameters.forEach(p => (p.percent = percent));
    }
}
