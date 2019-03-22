import { Component } from '@angular/core';
import { Fund, UserSettings } from 'shared';
import { App1Controller } from 'src/api/app1.controller';
import { Filter } from 'shared';

@Component({
  selector: 'p-poly',
  templateUrl: 'poly.component.html',
  styleUrls: ['poly.component.scss'],
})
export class PolyComponent {
  userSetting: UserSettings;
  funds: Fund[];
  userFiltersSettings: Filter;
  constructor(private api: App1Controller) {
    this.api.getInitialData().then(initialData => {
      this.funds = initialData.funds;
      this.userSetting = initialData.userSetting;
      this.userFiltersSettings = {
        options: this.userSetting.userFilters,
        selected: this.userSetting.userFilters[0],
        placeholder: 'Select from list, or create new one.' };
    });
  }
}
