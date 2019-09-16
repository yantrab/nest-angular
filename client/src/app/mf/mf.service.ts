import { Injectable } from '@angular/core';
import { MFController } from 'src/api/mf.controller';
import { ReplaySubject } from 'rxjs';
import {
    ComboboxFilter,
    Filter,
    GridGroup,
    SimulationRankType,
    SimulationSettings,
    SpecialFilter,
    UserFilter,
    UserSettings,
} from 'shared';
import { uniq, get, groupBy, cloneDeep, uniqBy, keyBy } from 'lodash';
import { I18nService } from '../shared/services/i18n.service';
import { I18nRootObject } from '../../api/i18n/mf.i18n';
import { ColumnDef } from 'mat-virtual-table';
import { format } from 'date-fns';
@Injectable({
    providedIn: 'root',
})
export class MfService {
    dateFormat = format;
    readonly selectedFilter: ReplaySubject<UserFilter> = new ReplaySubject();
    readonly userFilters: ReplaySubject<UserFilter[]> = new ReplaySubject();
    readonly funds: ReplaySubject<any> = new ReplaySubject();
    readonly simulationFund: ReplaySubject<any> = new ReplaySubject();

    readonly settings: ReplaySubject<UserSettings> = new ReplaySubject();
    private userSetting: UserSettings;
    public allFunds: any[];
    private selectedUserFilter: UserFilter;
    private gridGroups: Array<{
        isActive: boolean;
        children: Array<{ name: string; items: any[]; isActive: boolean; count: number }>;
        name: string;
        count: number;
        items: any[];
    }>;
    private simulationData: {
        gridGroupsSimulation: Array<{ name: string; count?: number }>;
        settings: SimulationSettings;
        typeRankFilter: Filter;
    };
    dic: I18nRootObject;
    constructor(private api: MFController, private i18nService: I18nService) {
        this.i18nService.dic.subscribe(result => {
            this.dic = result as any;
        });
        this.api.getInitialData().then(initialData => {
            this.allFunds = initialData.funds;
            this.userSetting = initialData.userSetting;
            const groups = groupBy(this.allFunds, f => get(f, this.userSetting.gridSettings.groupBy));
            this.gridGroups = Object.keys(groups).map(g => {
                const seconday = groupBy(groups[g], f => get(f, this.userSetting.gridSettings.secondaryGroupBy));
                const items = uniqBy(groups[g], this.userSetting.tableSettings.columns[0]);
                return {
                    isActive: true,
                    name: g,
                    count: items ? items.length : 0,
                    children: Object.keys(seconday).map(s => {
                        return {
                            name: s,
                            count: seconday[s].length,
                            isActive: true,
                            items: uniqBy(seconday[s], this.userSetting.tableSettings.columns[0]),
                        };
                    }),
                    items,
                };
            });
            this.selectedUserFilter = this.getDefaultFilters();

            this.simulationData = {
                gridGroupsSimulation: Object.keys(groups).map(g => ({ name: g })),
                settings: initialData.userSetting.simlulationSettings,
                typeRankFilter: new ComboboxFilter({
                    options: Object.keys(SimulationRankType).map(key => ({ _id: key, name: key })),
                }),
            };

            this.filterChanged();
            this.filterSimulationChanged();
            this.settings.next(this.userSetting);
            this.userFilters.next(this.userSetting.userFilters.filter(f => !f.isDefualt));
            this.selectedFilter.next(this.selectedUserFilter);
        });
    }

    getDefaultFilters() {
        let defaultTemplate = cloneDeep(this.userSetting.userFilters.find(f => f.isDefualt));
        const lastTemplate = localStorage.getItem('lastTemplate');
        if (lastTemplate) {
            defaultTemplate = new UserFilter(JSON.parse(lastTemplate));
        }
        defaultTemplate.gridGroups = this.gridGroups.map(
            g =>
                new GridGroup({
                    name: g.name,
                    isActive: g.isActive,
                    children: g.children.map(gg => ({ name: gg.name, isActive: gg.isActive })),
                }),
        );
        return defaultTemplate;
    }
    removeUserTemplate(template: UserFilter) {
        this.userSetting.userFilters = this.userSetting.userFilters.filter(f => f.name !== template.name);
        this.setSelectedUserFilter(this.getDefaultFilters());
    }
    setSelectedUserFilter(userFilter: UserFilter) {
        if (this.selectedUserFilter) {
            this.resetSelected([this.selectedUserFilter]);
        }

        if (!userFilter.filterGroups) {
            const defaults = cloneDeep(this.selectedUserFilter);
            userFilter.filterGroups = defaults.filterGroups;
            userFilter.gridGroups = defaults.gridGroups;
            userFilter.name = userFilter.name.replace(this.dic.findfund.filters.createNew, '');
            this.userSetting.userFilters.push(userFilter);
            this.selectedUserFilter = userFilter;
            this.filterChanged();
            this.userFilters.next(this.userSetting.userFilters.filter(f => !f.isDefualt));
            this.selectedFilter.next(userFilter);
            return;
        }
        this.selectedUserFilter = userFilter;
        this.filterChanged();
        this.selectedFilter.next(userFilter);
    }
    filterSimulationChanged() {
        let filteredFunds = this.allFunds;
        if (this.simulationData.settings.excludeFilter.selected) {
            filteredFunds = this.simulationData.settings.excludeFilter.doFilter(filteredFunds);
        }
        const excludeFunds = this.allFunds.filter(f => !filteredFunds.find(ff => ff.id === f.id));
        const groups = groupBy(excludeFunds, f => get(f, this.userSetting.gridSettings.groupBy));
        this.simulationData.gridGroupsSimulation.forEach(mainGroup => {
            mainGroup.count = groups[mainGroup.name] ? -groups[mainGroup.name].length : 0;
        });
        this.simulationFund.next({
            groups: this.simulationData.gridGroupsSimulation,
            settings: this.simulationData.settings,
            totalExclude: excludeFunds.length,
            typeRankFilter: this.simulationData.typeRankFilter,
        });
    }
    filterChanged() {
        let filteredFunds = this.allFunds;
        const columns: Array<ColumnDef & { isDate?: boolean }> = this.userSetting.tableSettings.columns.map(c => ({
            field: c,
            title: this.dic.findfund.filters.titles[c],
        }));
        this.selectedUserFilter.filterGroups.forEach(f => {
            const addFilterTOTable = filter => {
                if (filter.isActive && filter.selected) {
                    const filterFormat = filter.format
                        ? (new Function('value', 'return ' + filter.format).bind({ dateFormat: this.dateFormat }) as () => string)
                        : undefined;
                    filteredFunds = filter.doFilter(filteredFunds);
                    if (filter.optionNamePath || filter.optionIdPath) {
                        columns.push({
                            field: filter.optionNamePath || filter.optionIdPath,
                            title:
                                this.dic.findfund.filters.titles[filter.optionIdPath] ||
                                this.dic.findfund.filters.placeholders[filter.optionIdPath] ||
                                filter.optionIdPath,
                            format: filterFormat || groupFormat,
                            isDate: filter.kind === 'DateRangeComboFilter',
                        });
                    }
                }
            };
            const groupFormat = f.format
                ? (new Function('value', 'return ' + f.format).bind({ dateFormat: this.dateFormat }) as () => string)
                : undefined;
            f.filters.forEach(filter => {
                if (filter instanceof SpecialFilter && filter.selected) {
                    filter.selected.forEach(s => {
                        addFilterTOTable(s);
                    });
                } else {
                    addFilterTOTable(filter);
                }
            });
        });
        filteredFunds = uniqBy(filteredFunds, this.userSetting.tableSettings.columns[0]);
        const groups = groupBy(filteredFunds, f => get(f, this.userSetting.gridSettings.groupBy));
        const userGridGroups = keyBy(this.selectedUserFilter.gridGroups, 'name');
        this.gridGroups.forEach(mainGroup => {
            const userGridGroup = userGridGroups[mainGroup.name];
            const items = groups[mainGroup.name];
            mainGroup.isActive = userGridGroup ? userGridGroup.isActive : true;
            mainGroup.count = items ? items.length : 0;
            mainGroup.items = items;
            const secondaryGroups = groupBy(groups[mainGroup.name], f => get(f, this.userSetting.gridSettings.secondaryGroupBy));
            mainGroup.children.forEach(child => {
                const userChildGroup = userGridGroup ? userGridGroup.children.find(g => g.name === child.name) : undefined;
                child.isActive = userChildGroup ? userChildGroup.isActive : true;
                child.count = secondaryGroups[child.name] ? secondaryGroups[child.name].length : 0;
                child.items = uniqBy(secondaryGroups[child.name], this.userSetting.tableSettings.columns[0]);
            });
        });

        this.funds.next({
            items: filteredFunds,
            columns: uniq(columns),
            groups: this.gridGroups,
        });
        this.saveUserFilters();
    }

    private saveUserFilters() {
        const toSave = cloneDeep(this.userSetting.userFilters);
        if (toSave.length === 1 || this.selectedUserFilter.isDefualt) {
            localStorage.setItem('lastTemplate', JSON.stringify(this.selectedUserFilter));
            return;
        }

        this.resetSelected(toSave);
        this.resetSelected([toSave[0]], true);
        this.api.saveUserFilters(toSave);
    }

    resetSelected(userFilters, fullReset = false) {
        userFilters.forEach(userFilter =>
            userFilter.filterGroups.forEach(g =>
                g.filters.forEach(f => {
                    if (fullReset) {
                        f.isActive = false;
                        f.selected = undefined;
                        return;
                    }

                    if (!f.isActive) {
                        f.selected = undefined;
                    }
                }),
            ),
        );
    }
}
