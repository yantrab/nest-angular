import { Component } from '@angular/core';
import { Filter, UserFilter } from 'shared';
import { filterFn } from '../../shared/components/filters/autocomplete/autocomplete.component';
import { MfService } from '../mf.service';
@Component({
  selector: 'p-poly',
  templateUrl: 'poly.component.html',
  styleUrls: ['poly.component.scss'],
})
export class PolyComponent {
  userFiltersSettings: Filter = { options: [], placeholder: 'Select or create new.', selected: {} };
  readonly NEW = ' (Create new) ';
  constructor(private mfService: MfService) {
    this.mfService.userFilters.subscribe(userFilters => {
      this.userFiltersSettings = Object.assign({}, this.userFiltersSettings, { options: [...userFilters] });
      this.mfService.selectedFilter.subscribe(selected => {
        this.userFiltersSettings = Object.assign({}, this.userFiltersSettings, { selected });
      });
    });
  }

  filterFn = (options: any[], query: string) => {
    if (this.userFiltersSettings.options.find(f => f.name !== query)) {
      return [{ name: query + this.NEW } as UserFilter].concat(filterFn(options, query));
    }
    return filterFn(options, query);
  }

  filterSelected(userFilter: UserFilter) {
    this.mfService.setSelectedUserFilter(userFilter);
  }
}
