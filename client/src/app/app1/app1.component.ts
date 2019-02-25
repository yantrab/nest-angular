import { Component } from '@angular/core';
import { Filter, CheckboxFilter } from 'shared';
import { DropdownFilter } from '../../../../shared';

@Component({
  selector: 'app1-root',
  template: `
  <div fxLayout='column' fxFlex='200px'>
    <p-filter [filter]="filter1"></p-filter>
    <p-filter [filter]="filter2"></p-filter>
  <div>
  `,
  styles: []
})
export class App1Component {
  filter1: Filter;
  filter2: Filter;
  constructor() {
    this.filter1 =
      new CheckboxFilter({ options: [{ _id: '1', name: 'name1' }, { _id: '2', name: 'name2' }], selected: { _id: '2', name: 'name2' } });
    this.filter2 =
      new DropdownFilter({ options: [{ _id: '1', name: 'name1' }, { _id: '2', name: 'name2' }], selected: { _id: '2', name: 'name2' } });
  }
}
