import { Component } from '@angular/core';
import { Filter, CheckboxFilter, DropdownFilter } from 'shared';

@Component({
  selector: 'p-poly',
  template: `
  <div fxLayout='column' fxFlex='200px'>
    <p-filter [filter]="filter1"></p-filter>
    <p-filter [filter]="filter2"></p-filter>
  <div>
`
})
export class PolyComponent {
  filter1: Filter;
  filter2: Filter;
  constructor() {
    this.filter1 =
      new CheckboxFilter({ options: [{ _id: '1', name: 'name1' }, { _id: '2', name: 'name2' }], selected: { _id: '2', name: 'name2' } });

    console.log(this.filter1);
    this.filter2 =
      new DropdownFilter({ options: [{ _id: '1', name: 'name1' }, { _id: '2', name: 'name2' }], selected: { _id: '2', name: 'name2' } });
    console.log(this.filter2);
  }
}
