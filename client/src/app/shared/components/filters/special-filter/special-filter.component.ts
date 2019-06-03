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
    onSelect(option: any) {
        if (!this.settings.selected) {
            this.settings.selected = [];
        }
        this.settings.isActive = true;
        this.settings.selected.push(...[option.filter]);
    }
    filterChange(filter) {
        filter.isActive = true;
        this.selectedChange.emit();
    }

    ngOnInit(): void {
        this.autoSettings = new AutocompleteFilter({ options: this.settings.options });
    }
}
