import { Component, ViewEncapsulation } from '@angular/core';
import { UserFilter, AutocompleteFilter } from 'shared';
import { MfService } from '../mf.service';
import { ColumnDef } from 'mat-virtual-table';
import { I18nService } from '../../shared/services/i18n.service';
import { I18nFindfund } from '../../../api/i18n/mf.i18n';

@Component({
    selector: 'p-findFund',
    templateUrl: 'findFund.component.html',
    styleUrls: ['findFund.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class FindFundComponent {
    userFiltersSettings: AutocompleteFilter = new AutocompleteFilter({
        options: [],
        placeholder: 'Select or create new.',
        selected: {},
    });
    dic: I18nFindfund;
    funds;
    specialView = false;
    gridGroups;
    specialGridGroups;
    fundColumns: ColumnDef[];
    constructor(private mfService: MfService, public i18nService: I18nService) {
        this.i18nService.dic.subscribe(result => (this.dic = (result as any).findfund));
        this.mfService.userFilters.subscribe(userFilters => {
            this.userFiltersSettings = Object.assign({}, this.userFiltersSettings, { options: [...userFilters] });
            this.mfService.selectedFilter.subscribe(selected => {
                this.userFiltersSettings = Object.assign({}, this.userFiltersSettings, { selected });
            });
        });
        this.mfService.funds.subscribe(funds => {
            this.funds = funds.items;
            this.fundColumns = funds.columns.map(c => ({ field: c, title: c }));
            this.gridGroups = funds.groups;
            this.specialGridGroups = funds.groups.filter(g => g.count);
            // this.specialGridGroups.forEach(g => (g.children = g.children.filter(c => c.count)));
        });
    }

    hasItems(group) {
        return !!group.count;
    }
    filterSelected(userFilter: UserFilter) {
        this.mfService.setSelectedUserFilter(userFilter);
    }
}
