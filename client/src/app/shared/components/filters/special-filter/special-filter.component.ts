import { Component, KeyValueDiffers, OnInit } from '@angular/core';
import { BaseFilterComponent } from '../base.component';
import { AutocompleteFilter, Filter } from 'shared/models';

@Component({
    selector: 'p-special-filter',
    templateUrl: './special-filter.component.html',
    styleUrls: ['./special-filter.component.scss'],
})
export class SpecialFilterComponent extends BaseFilterComponent implements OnInit {
    autoSettings: Filter;
    constructor(differs: KeyValueDiffers) {
        super(differs);
    }
    onSelect($event: any) {}

    ngOnInit(): void {
        this.autoSettings = new AutocompleteFilter({ options: this.settings.options });
    }
}
