import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Filter, QuantityFilter } from 'shared';
import { CheckboxFilter, DropdownFilter, AutocompleteFilter } from 'shared/models/filter.model';
import { QuantityFilterComponent } from '../quantity-filter/quantity-filter.component';
@Component({
    selector: 'p-filter',
    template: `
        <p-checkbox
            (selectedChange)="selectedChange.emit()"
            *ngIf="filter.kind == filterTypes.checkboxFilter"
            [settings]="filter"
        ></p-checkbox>
        <p-dropdown
            (selectedChange)="selectedChange.emit()"
            *ngIf="filter.kind == filterTypes.dropdownFilter"
            [settings]="filter"
        ></p-dropdown>
        <p-autocomplete
            (selectedChange)="selectedChange.emit()"
            *ngIf="filter.kind == filterTypes.autocompleteFilter"
            [settings]="filter"
        ></p-autocomplete>
        <p-quantity-filter
            (selectedChange)="selectedChange.emit()"
            *ngIf="filter.kind == filterTypes.quantityFilterComponent"
            [settings]="filter"
        ></p-quantity-filter>
    `,
})
export class FilterComponent {
    @Input() filter: Filter;
    @Output() selectedChange = new EventEmitter();

    filterTypes = {
        checkboxFilter: CheckboxFilter.name,
        dropdownFilter: DropdownFilter.name,
        autocompleteFilter: AutocompleteFilter.name,
        quantityFilterComponent: QuantityFilter.name,
    };
}
