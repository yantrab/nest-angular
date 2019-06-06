import { Injectable } from '@angular/core';
import { MFController } from 'src/api/mf.controller';
import { ReplaySubject } from 'rxjs';
import { UserFilter, UserSettings } from 'shared';
import { uniq, get, groupBy, orderBy } from 'lodash';

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
    private gridGroups: Array<{ children: Array<{ name: string; count: any }>; name: string; count: number }>;
    constructor(private api: MFController) {
        this.api.getInitialData().then(initialData => {
            this.allFunds = initialData.funds;
            this.userSetting = initialData.userSetting;
            this.selectedUserFilter = this.userSetting.userFilters[0];
            const groups = groupBy(this.allFunds, f => get(f, this.userSetting.gridSettings.groupBy));
            this.gridGroups = orderBy(
                Object.keys(groups).map(g => {
                    const seconday = groupBy(groups[g], f => get(f, this.userSetting.gridSettings.secondaryGroupBy));
                    return {
                        name: g,
                        count: groups[g] ? groups[g].length : 0,
                        children: Object.keys(seconday).map(s => ({ name: s, count: seconday[s].length })),
                    };
                }),
                f => f.children.length,
                'desc',
            );
            this.filterChanged();
            this.settings.next(this.userSetting);
            this.userFilters.next(this.userSetting.userFilters);
            this.selectedFilter.next(this.selectedUserFilter);
        });
    }
    unloadHandler() {
        return this.api.saveUserSettings(this.userSetting);
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
        const columns = [...this.userSetting.tableSettings.columns];
        this.selectedUserFilter.filterGroups.forEach(f =>
            f.filters.forEach(filter => {
                if (filter.kind === 'SpecialFilter') {
                    filter.options.forEach(option => {
                        if (!option.filter.options) {
                            option.filter.createOptions(this.allFunds);
                        }
                    });
                }

                if (!filter.options) {
                    filter.createOptions(this.allFunds);
                }

                if (filter.isActive && filter.selected) {
                    filteredFunds = filter.doFilter(filteredFunds);
                    if (filter.optionNamePath || filter.optionIdPath) {
                        columns.push(filter.optionNamePath || filter.optionIdPath);
                    }
                }
            }),
        );
        const groups = groupBy(filteredFunds, f => get(f, this.userSetting.gridSettings.groupBy));
        this.gridGroups.forEach(mainGroup => {
            mainGroup.count = groups[mainGroup.name] ? groups[mainGroup.name].length : 0;
            const secondaryGroups = groupBy(groups[mainGroup.name], f => get(f, this.userSetting.gridSettings.secondaryGroupBy));
            mainGroup.children.forEach(child => {
                child.count = secondaryGroups[child.name] ? secondaryGroups[child.name].length : 0;
            });
        });

        this.funds.next({
            items: filteredFunds,
            columns: uniq(columns),
            groups: this.gridGroups,
        });
        this.api.saveUserSettings(this.userSetting);
    }
}
