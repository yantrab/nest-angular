import { Injectable } from '@angular/core';
import { App1Controller } from 'src/api/app1.controller';
import { ReplaySubject } from 'rxjs';
import { UserFilter, UserSettings, Fund } from 'shared';
export const NEW = ' (Create new) ';
@Injectable({
  providedIn: 'root'
})
export class MfService {
  readonly selectedFilter: ReplaySubject<UserFilter> = new ReplaySubject();
  readonly userFilters: ReplaySubject<UserFilter[]> = new ReplaySubject();
  private userSetting: UserSettings;
  private funds: Fund[];
  constructor(private api: App1Controller) {
    this.api.getInitialData().then(initialData => {
      this.funds = initialData.funds;
      this.userSetting = initialData.userSetting;
      this.userFilters.next(this.userSetting.userFilters);
      this.selectedFilter.next(this.userSetting.userFilters[0]);
    });
  }

  setSelectedUserFilter(userFilter: UserFilter) {
    if (!userFilter.isNew) {
      userFilter.filterGroups = this.userSetting.userFilters.find(f => f.isDefualt).filterGroups;
      userFilter.name = userFilter.name.replace(NEW, '');
      this.userSetting.userFilters.push(userFilter);
      this.userFilters.next(this.userSetting.userFilters);
    }

    this.selectedFilter.next(userFilter);
  }
}
