import { Component, ViewEncapsulation } from '@angular/core';
import { UserFilter, AutocompleteFilter, ComboboxFilter } from 'shared';
import { MfService } from '../mf.service';
import { ColumnDef } from 'mat-virtual-table';
import { I18nService } from '../../shared/services/i18n.service';
import { I18nFindfund } from '../../../api/i18n/mf.i18n';
import { ParameterPickerComponent } from '../../shared/components/parameter-picker/parameter-picker.component';
import { DialogService } from '../../shared/services/dialog.service';
import { orderBy } from 'lodash';
import { MatTabChangeEvent } from '@angular/material';
import { format } from 'date-fns';
import { XLSXService } from '../../shared/services/xlsx.service';

@Component({
    selector: 'p-findFund',
    templateUrl: 'findFund.component.html',
    styleUrls: ['findFund.component.scss'],
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindFundComponent {
    userFiltersSettings: AutocompleteFilter;
    dic: I18nFindfund;
    filtersDic: any;
    funds;
    dir;
    comboboxSettings = new ComboboxFilter({ options: [{ name: 'SelectAll', _id: 0 }, { name: 'Custom', _id: 1 }] });
    specialView = false;
    gridGroups: any[];
    specialGridGroups;
    specialGridGroupsAsside = [];
    fundColumns: ColumnDef[];
    public isGrid: boolean = true;
    selectedTemplate: UserFilter;

    constructor(
        public mfService: MfService,
        public i18nService: I18nService,
        public dialog: DialogService,
        private xslService: XLSXService,
    ) {
        this.i18nService.dic.subscribe(result => {
            this.dic = (result as any).findfund;
            this.dir = this.i18nService.dir;
            this.filtersDic = { placeholders: this.dic.filters.placeholders, titles: this.dic.filters.titles };
        });

        this.mfService.userFilters.subscribe(userFilters => {
            this.userFiltersSettings = new AutocompleteFilter({
                placeholder: this.dic.filters.selectFilter,
                options: [...userFilters],
                selected: {},
            });
        });
        this.mfService.selectedFilter.subscribe(selected => {
            this.selectedTemplate = selected;
            this.userFiltersSettings = Object.assign({}, this.userFiltersSettings, {
                selected: !selected.isDefualt ? selected : undefined,
            });
        });

        this.mfService.funds.subscribe(funds => {
            this.fundColumns = funds.columns;
            this.gridGroups = funds.groups;
            const temp = [];
            const a = orderBy(funds.groups.filter(f => f.name.includes('אג"ח')), g => g.count, 'desc');
            const a6 = a.filter(g => g.children.length > 4 && g.count > 0);
            const a3 = a.filter(g => g.children.length < 5 && g.count > 0);

            const b = orderBy(funds.groups.filter(f => f.name.includes('מניות')), g => g.count, 'desc');
            const b6 = b.filter(g => g.children.length > 4 && g.count > 0);
            const b3 = b.filter(g => g.children.length < 5 && g.count > 0);

            const d = orderBy(
                funds.groups.filter(f => !f.name.includes('אג"ח') && !f.name.includes('מניות')),
                g => g.count,
                'desc',
            );
            const d6 = d.filter(g => g.children.length > 4 && g.count > 0);
            const d3 = d.filter(g => g.children.length < 5 && g.count > 0);

            temp.push(a6.concat(new Array(3).fill(undefined)).slice(0, 3));
            temp.push(a3.concat(new Array(3).fill(undefined)).slice(0, 3));
            this.specialGridGroupsAsside[0] = a6[3] || d6[0];
            this.specialGridGroupsAsside[1] = d3[0];
            this.specialGridGroupsAsside[2] = d3[1];
            this.specialGridGroupsAsside[3] = d3[2];
            this.specialGridGroupsAsside[4] = d3[3];
            temp.push([a6[4], b6[0], a6[3] ? d6[0] : undefined]);
            temp.push(b3.concat(new Array(3).fill(undefined)).slice(0, 3));
            this.specialGridGroups = [];
            temp.forEach(t => {
                if (t.find(tt => tt)) {
                    this.specialGridGroups.push(...t);
                }
            });
            this.updateFunds();
            this.comboboxSettings.selected = this.gridGroups.every(g => g.children.every(c => c.isActive))
                ? this.comboboxSettings.options[0]
                : this.comboboxSettings.options[1];
        });
    }
    tabChanged(event: MatTabChangeEvent): void {
        this.isGrid = event.tab.textLabel === this.dic.tabs.grid;
    }
    removeUserFilter(template) {
        this.mfService.removeUserTemplate(template);
    }
    filterSelected(userFilter: UserFilter) {
        this.mfService.setSelectedUserFilter(userFilter);
    }
    openSettingsDialog(): void {
        this.dialog.open(ParameterPickerComponent, {
            width: '900px',
            data: {
                groups: this.selectedTemplate.filterGroups,
                bindingParamterName: 'show',
                childrenPatameterName: 'filters',
                parameterTitleName: 'optionIdPath',
                dic: this.dic.filters.placeholders,
                title: this.dic.filters.customizePatamsTitle,
                isSmall: true,
            },
        });
    }
    download() {
        const data = [];
        this.funds.forEach(f => {
            const row = {};
            this.fundColumns.forEach((c: any) => {
                const value = f[c.field || c.title];
                row[c.title || c.field] = c.isDate ? new Date(value) : value; // c.format ? c.format(value) : value;
            });
            data.push(row);
        });

        this.xslService.export([{ rows: data }], ['מצא קרן'], 'מצא קרן' + format(new Date(), 'dd.MM.yyyy') + '.xlsx');
    }
    comboboxSelect(selected) {
        if (selected) {
            const isSelectAll = selected.name === 'SelectAll';
            this.selectedTemplate.gridGroups.forEach(g => {
                g.isActive = isSelectAll;
                g.children.forEach(c => (c.isActive = isSelectAll));
            });
            this.mfService.filterChanged();
        }
    }
    onGroupClick(group: any) {
        if (!group.count) {
            return;
        }
        let userGroup: any = this.selectedTemplate.gridGroups.find(gg => gg.name === group.name);
        if (!userGroup) {
            userGroup = this.selectedTemplate.gridGroups
                .find(gg => !!gg.children.find(g => g.name === group.name))
                .children.find(g => g.name === group.name);
        }
        if (userGroup.children) {
            userGroup.children.forEach(c => (c.isActive = !group.isActive));
        }

        userGroup.isActive = !userGroup.isActive;
        this.mfService.filterChanged();
    }

    updateFunds() {
        this.funds = this.gridGroups.reduce((result, group) => {
            result = result.concat(
                group.children.reduce((res, child) => {
                    if (child.isActive) {
                        res = res.concat(child.items);
                    }
                    return res;
                }, []),
            );
            return result;
        }, []);
    }
}
