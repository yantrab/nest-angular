import { Component, KeyValueDiffers, OnInit } from '@angular/core';
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
}
