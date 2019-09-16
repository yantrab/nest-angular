import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogService } from '../../../shared/services/dialog.service';
import { GroupViewComponent } from './group-view/group-view.component';
import { I18nFindfund } from '../../../../api/i18n/mf.i18n';

@Component({
    selector: 'p-special-grid',
    templateUrl: './special-grid.component.html',
    styleUrls: ['./special-grid.component.scss'],
})
export class SpecialGridComponent {
    @Input() mainGroup;
    @Input() columns;
    @Input() assideGroup;
    @Output() groupClick = new EventEmitter();
    @Input() dic: I18nFindfund;
    hasItems(group) {
        return !!group.count;
    }
    constructor(private dialog: DialogService) {}
    openView(group) {
        this.dialog.open(GroupViewComponent, {
            width: '900px',
            height: 'auto',
            data: {
                group,
                columnsDef: this.columns,
            },
            title: this.dic.grid.quikView + ' ' + group.name,
        });
    }
}
