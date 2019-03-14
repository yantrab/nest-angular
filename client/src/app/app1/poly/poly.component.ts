import { Component } from '@angular/core';
import { Filter } from 'shared';
import { App1Controller } from 'src/api/app1.controller';

@Component({
  selector: 'p-poly',
  template: `
  <div fxLayout='column' fxFlex='200px'>
    <p-filter *ngFor="let filter of filters" [filter]="filter"></p-filter>
  <div>
`
})
export class PolyComponent {
  filters: Filter[];
  constructor(private api: App1Controller) {
    this.api.getUserFilters().then(filters => this.filters = filters);
    this.api.getFunds().then(console.log);
  }
}
