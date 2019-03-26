import { Component } from '@angular/core';
import { Filter, UserFilter, AutocompleteFilter } from 'shared';
import { filterFn } from 'src/app/shared/components/filters/autocomplete/autocomplete.component';
import { MfService, NEW } from '../mf.service';
@Component({
  selector: 'p-poly',
  templateUrl: 'poly.component.html',
  styleUrls: ['poly.component.scss'],
})
export class PolyComponent {
  userFiltersSettings: AutocompleteFilter = new AutocompleteFilter({ options: [], placeholder: 'Select or create new.', selected: {} });
  constructor(private mfService: MfService) {
    this.mfService.userFilters.subscribe(userFilters => {
      this.userFiltersSettings = Object.assign({}, this.userFiltersSettings, { options: [...userFilters] });
      this.mfService.selectedFilter.subscribe(selected => {
        this.userFiltersSettings = Object.assign({}, this.userFiltersSettings, { selected });
      });
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
