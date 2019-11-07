import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Filter } from 'shared';
import * as Filters from 'shared/models/filter.model';

@Component({
    selector: 'p-filter',
    styles: [':host {height: 100%;width: 100%;}'],
    template: `
        <p-checkbox
            (selectedChange)="selectedChange.emit()"
            [dic]="dic"
            *ngIf="filter.kind == filters.CheckboxFilter.name"
            [settings]="filter"
        ></p-checkbox>
        <p-dropdown
            [dic]="dic"
            (selectedChange)="selectedChange.emit()"
            *ngIf="filter.kind == filters.DropdownFilter.name"
            [settings]="filter"
        ></p-dropdown>
        <p-autocomplete
            [dic]="dic"
            (selectedChange)="selectedChange.emit()"
            *ngIf="filter.kind == filters.AutocompleteFilter.name"
            [settings]="filter"
        ></p-autocomplete>
        <p-quantity-filter
            [dic]="dic"
            (selectedChange)="selectedChange.emit()"
            *ngIf="filter.kind == filters.QuantityFilter.name"
            [settings]="filter"
        ></p-quantity-filter>
        <p-special-filter
            [dic]="dic"
            (selectedChange)="selectedChange.emit()"
            *ngIf="filter.kind == filters.SpecialFilter.name"
            [settings]="filter"
        ></p-special-filter>
        <p-special-filter-grid
            [dic]="dic"
            (selectedChange)="selectedChange.emit()"
            *ngIf="filter.kind == filters.SpecialFilterGrid.name"
            [settings]="filter"
        ></p-special-filter-grid>
        <p-combobox
            [dic]="dic"
            (selectedChange)="selectedChange.emit()"
            *ngIf="[filters.DateRangeComboFilter.name, filters.ComboboxFilter.name].includes(filter.kind)"
            [settings]="filter"
        ></p-combobox>
    `,
})
export class FilterComponent {
    @Input() filter: Filter;
    @Input() dic = { placeholder: {}, titles: {} };
    @Output() selectedChange = new EventEmitter();
    filters = Filters;
}
