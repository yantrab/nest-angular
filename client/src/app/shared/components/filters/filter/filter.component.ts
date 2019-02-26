import { Component, OnInit, Input } from '@angular/core';
import { Filter } from 'shared';
import { CheckboxFilter, DropdownFilter } from 'shared';
@Component({
  selector: 'p-filter',
  template: `
  <p-checkbox *ngIf="filter.kind == filterTypes.checkboxFilter" [settings]="filter"></p-checkbox>
  <p-dropdown *ngIf="filter.kind == filterTypes.dropdownFilter" [settings]="filter"></p-dropdown>
  `,
})
export class FilterComponent {
  @Input()
  filter: Filter;
  filterTypes = { checkboxFilter: CheckboxFilter.name, dropdownFilter: DropdownFilter.name };
}
