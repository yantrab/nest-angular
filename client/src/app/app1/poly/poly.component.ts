import { Component } from '@angular/core';
import { Filter } from 'shared';
import { App1Controller } from 'src/api/app1.controller';

@Component({
  selector: 'p-poly',
  templateUrl: 'poly.component.html'
})
export class PolyComponent {
  filters: Filter[];
  funds;
  constructor(private api: App1Controller) {
    this.api.getUserFilters().then(filters => this.filters = filters);
    this.api.getFunds().then(data => this.funds = data);
  }
}
