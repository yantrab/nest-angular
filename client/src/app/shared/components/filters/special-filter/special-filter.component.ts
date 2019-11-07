import { Component, KeyValueDiffers, OnChanges, OnInit, SimpleChanges, Input } from '@angular/core';
import { BaseFilterComponent } from '../base.component';
import { AutocompleteFilter, Filter } from 'shared/models';
import { cloneDeep } from 'lodash';

@Component({
    selector: 'p-special-filter',
    templateUrl: './special-filter.component.html',
    styleUrls: ['./special-filter.component.scss'],
})
export class SpecialFilterComponent extends BaseFilterComponent implements OnInit, OnChanges {
    autoSettings: Filter;
    constructor(differs: KeyValueDiffers) {
        super(differs);
    }
    onSelect(option: any) {
        if (!this.settings.selected) {
            this.settings.selected = [];
        }
        this.settings.isActive = true;
        this.settings.selected.unshift(...[option.filter]);
    }
    filterChange(filter) {
        filter.isActive = true;
        this.selectedChange.emit();
    }

    ngOnInit(): void {
        const options = cloneDeep(this.settings.options);
        options.forEach(o => (o.name = this.dic[o.name] || o.name));
        this.autoSettings = new AutocompleteFilter({ options, placeholder: this.settings.placeholder });
        if (this.settings.selected) {
            this.settings.selected = this.settings.selected.filter(s => s.selected && s.isActive);
            if (!this.settings.selected.length) {
                this.settings.selected = undefined;
            }
        }
    }
    ngOnChanges(changes: SimpleChanges) {
        if (!this.autoSettings || !this.autoSettings.options) {
            return;
        }
        this.autoSettings.options.forEach(o => (o.name = this.dic[o.name] || o.name));
    }
}
