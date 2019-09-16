import { Component, Input, EventEmitter, Output } from '@angular/core';
import { DialogService } from '../../shared/services/dialog.service';
import { ColumnDef, TableComponent } from 'mat-virtual-table';
import { I18nService } from '../../shared/services/i18n.service';
import { I18nGrid } from '../../../api/i18n/mf.i18n';

@Component({
    selector: 'p-simple-grid',
    templateUrl: './simple-grid.component.html',
    styleUrls: ['./simple-grid.component.scss'],
})
export class SimpleGridComponent {
    @Input() groups;
    @Input() columns;
    @Input() specialView;
    @Output() groupClick = new EventEmitter();
    dic: I18nGrid;
    constructor(private dialog: DialogService, public i18nService: I18nService) {
        this.i18nService.dic.subscribe(result => (this.dic = (result as any).findfund.grid));
    }

    openList(group) {
        this.dialog.open(TableComponent, {
            width: '900px',
            height: '500px',
            data: {
                rows: group.items,
                columnsDef: this.columns,
                isResizable: true,
            },
            title: this.dic.quikView + group.name,
        });
    }
}
