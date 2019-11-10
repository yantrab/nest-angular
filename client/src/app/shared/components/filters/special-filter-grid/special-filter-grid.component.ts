import { Component, KeyValueDiffers } from '@angular/core';
import { BaseFilterComponent } from '../base.component';

@Component({
    selector: 'p-special-filter-grid',
    templateUrl: './special-filter-grid.component.html',
    styleUrls: ['./special-filter-grid.component.scss'],
})
export class SpecialFilterGridComponent extends BaseFilterComponent {
    isOpen = false;
    constructor(differs: KeyValueDiffers) {
        super(differs);
    }

    add(filterGroup: any) {
        if (!this.settings.selected) {
            this.settings.selected = [];
        }
        this.settings.selected.push(filterGroup);
    }
}
