import { Component, Input, KeyValueDiffers } from '@angular/core';
import { BaseFilterComponent } from '../base.component';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'p-combobox',
    templateUrl: './combobox.component.html',
    styleUrls: ['./combobox.component.scss'],
})
export class ComboboxComponent extends BaseFilterComponent {
    @Input() labelPosition = 'after';
    constructor(differs: KeyValueDiffers) {
        super(differs);
    }
    input: FormControl = new FormControl();
    change(option) {
        this.optionSelected(option);
        this.selectedChange.emit();
    }
}
