import { Component, KeyValueDiffers } from '@angular/core';
import { BaseFilterComponent } from '../base.component';

@Component({
    selector: 'p-combobox',
    templateUrl: './combobox.component.html',
    styleUrls: ['./combobox.component.scss'],
})
export class ComboboxComponent extends BaseFilterComponent {
    constructor(differs: KeyValueDiffers) {
        super(differs);
    }

    change(option) {
        if (option) {
            this.optionSelected(option);
        } else {
            this.selectedChange.emit();
        }
    }
}
