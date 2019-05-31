import { Injectable } from '@angular/core';
import { MFController } from 'src/api/mf.controller';
import { ReplaySubject } from 'rxjs';
import { UserFilter, UserSettings, Fund, Filter } from 'shared';
import { uniq, get } from 'lodash';

export const NEW = ' (Create new) ';
@Injectable({
    providedIn: 'root',
})
export class MfService {
    readonly selectedFilter: ReplaySubject<UserFilter> = new ReplaySubject();
    readonly userFilters: ReplaySubject<UserFilter[]> = new ReplaySubject();
    readonly funds: ReplaySubject<any> = new ReplaySubject();
    readonly settings: ReplaySubject<UserSettings> = new ReplaySubject();
    private userSetting: UserSettings;
    private allFunds: any[];
    private selectedUserFilter: UserFilter;
    constructor(private api: MFController) {
        this.api.getInitialData().then(initialData => {
            this.allFunds = initialData.funds;
            this.userSetting = initialData.userSetting;
            this.selectedUserFilter = this.userSetting.userFilters[0];
            this.filterChanged();
            this.settings.next(this.userSetting);
            this.userFilters.next(this.userSetting.userFilters);
            this.selectedFilter.next(this.selectedUserFilter);
        });
    }

    setSelectedUserFilter(userFilter: UserFilter) {
        if (!userFilter.isNew) {
            userFilter.filterGroups = this.userSetting.userFilters.find(f => f.isDefualt).filterGroups;
            userFilter.name = userFilter.name.replace(NEW, '');
            this.userSetting.userFilters.push(userFilter);
            this.filterChanged();
            this.userFilters.next(this.userSetting.userFilters);
        }

        this.selectedFilter.next(userFilter);
    }
    filterChanged() {
        let filteredFunds = this.allFunds;
        const columns = this.userSetting.tableSettings.columns;
        this.selectedUserFilter.filterGroups.forEach(f =>
            f.filters.forEach(filter => {
                if (!filter.options) {
                    filter.createOptions(this.allFunds);
                }
                if (filter.isActive && filter.selected) {
                    filteredFunds = filter.doFilter(filteredFunds);
                    columns.push(filter.optionNamePath || filter.optionIdPath);
                }
            }),
        );
        this.funds.next({
            items: filteredFunds,
            columns: uniq(columns),
            groupBy: this.userSetting.gridSettings.groupBy,
            allGroups: uniq(this.allFunds.map(a => get(a, this.userSetting.gridSettings.groupBy))),
        });
    }
}
