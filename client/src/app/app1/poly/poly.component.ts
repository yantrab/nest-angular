import { Component, ViewEncapsulation } from '@angular/core';
import { Filter, UserFilter, AutocompleteFilter, Fund } from 'shared';
import { filterFn } from 'src/app/shared/components/filters/autocomplete/autocomplete.component';
import { MfService, NEW } from '../mf.service';
import { Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
@Component({
  selector: 'p-poly',
  templateUrl: 'poly.component.html',
  styleUrls: ['poly.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PolyComponent {
  userFiltersSettings: AutocompleteFilter = new AutocompleteFilter({ options: [], placeholder: 'Select or create new.', selected: {} });
  funds;
  constructor(private mfService: MfService) {
    this.mfService.userFilters.subscribe(userFilters => {
      this.userFiltersSettings = Object.assign({}, this.userFiltersSettings, { options: [...userFilters] });
      this.mfService.selectedFilter.subscribe(selected => {
        this.userFiltersSettings = Object.assign({}, this.userFiltersSettings, { selected });
      });
    });
    this.mfService.funds.subscribe(funds => {
      this.funds =  funds.map((fund, i) => ({ id: i + 1, name: fund._id }));
    });
}

filterFn = (options: any[], query: string) => {
  query = query.trim();
  if (query && !this.userFiltersSettings.options.find(f => f.name === query)) {
    return [{ name: query + NEW } as UserFilter].concat(filterFn(options, query));
  }
  return filterFn(options, query);
}

filterSelected(userFilter: UserFilter) {
  this.mfService.setSelectedUserFilter(userFilter);
}
}
