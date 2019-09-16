import { Component, KeyValueDiffers } from '@angular/core';
import { BaseFilterComponent } from '../base.component';

@Component({
    selector: 'p-quantity-filter',
    templateUrl: './quantity-filter.component.html',
    styleUrls: ['./quantity-filter.component.scss'],
})
export class QuantityFilterComponent extends BaseFilterComponent {
    constructor(differs: KeyValueDiffers) {
        super(differs);
    }
    flag = false;
    onValueChanged(ev) {
        // if (!ev.event) return;
        if (this.flag) {
            this.flag = false;
            return;
        }
        this.optionSelected(ev.value);
    }

    dataSourceChange() {
        this.flag = true;
    }
}
