import { Component, OnInit, Input } from '@angular/core';
import { Filter } from 'shared';
import { CheckboxFilter, DropdownFilter } from 'shared';
@Component({
  selector: 'p-filter',
  template: `
  <p-checkbox *ngIf="filter.kind == filterTypes.CheckboxFilter.name" [settings]="filter"></p-checkbox>
  <p-dropdown *ngIf="filter.kind == filterTypes.DropdownFilter.name" [settings]="filter"></p-dropdown>
  `,
})
export class FilterComponent {
  @Input()
  filter: Filter;
  filterTypes = { CheckboxFilter, DropdownFilter };
}
