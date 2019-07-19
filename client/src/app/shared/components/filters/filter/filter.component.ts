import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComboboxFilter, DateRangeComboFilter, Filter, QuantityFilter, SpecialFilter } from 'shared';
import { CheckboxFilter, DropdownFilter, AutocompleteFilter } from 'shared/models/filter.model';
// import { QuantityFilterComponent } from '../quantity-filter/quantity-filter.component';
@Component({
    selector: 'p-filter',
    styles: [':host {height: 100%;width: 100%;}'],
    template: `
        <p-checkbox
            (selectedChange)="selectedChange.emit()"
            [dic]="dic"
            *ngIf="filter.kind == filterTypes.checkboxFilter"
            [settings]="filter"
            [dataSource]="dataSource"
        ></p-checkbox>
        <p-dropdown
            [dic]="dic"
            (selectedChange)="selectedChange.emit()"
            *ngIf="filter.kind == filterTypes.dropdownFilter"
            [settings]="filter"
            [dataSource]="dataSource"
        ></p-dropdown>
        <p-autocomplete
            [dic]="dic"
            (selectedChange)="selectedChange.emit()"
            *ngIf="filter.kind == filterTypes.autocompleteFilter"
            [settings]="filter"
            [dataSource]="dataSource"
        ></p-autocomplete>
        <p-quantity-filter
            [dic]="dic"
            (selectedChange)="selectedChange.emit()"
            *ngIf="filter.kind == filterTypes.quantityFilterComponent"
            [settings]="filter"
            [dataSource]="dataSource"
        ></p-quantity-filter>
        <p-special-filter
            [dic]="dic"
            (selectedChange)="selectedChange.emit()"
            *ngIf="filter.kind == filterTypes.specialFilterComponent"
            [settings]="filter"
            [dataSource]="dataSource"
        ></p-special-filter>
        <p-combobox
            [dic]="dic"
            (selectedChange)="selectedChange.emit()"
            *ngIf="[filterTypes.DateRangeComboFilter, filterTypes.ComboboxFilter].includes(filter.kind)"
            [settings]="filter"
            [dataSource]="dataSource"
        ></p-combobox>
    `,
})
export class FilterComponent {
    @Input() filter: Filter;
    @Input() dic;
    @Output() selectedChange = new EventEmitter();
    @Input() dataSource;
    filterTypes = {
        checkboxFilter: CheckboxFilter.name,
        dropdownFilter: DropdownFilter.name,
        autocompleteFilter: AutocompleteFilter.name,
        quantityFilterComponent: QuantityFilter.name,
        specialFilterComponent: SpecialFilter.name,
        DateRangeComboFilter: DateRangeComboFilter.name,
        ComboboxFilter: ComboboxFilter.name,
    };
}
