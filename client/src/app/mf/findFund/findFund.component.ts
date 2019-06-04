import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { UserFilter, AutocompleteFilter } from 'shared';
import { MfService } from '../mf.service';
import { ColumnDef } from 'mat-virtual-table';
import { groupBy, get } from 'lodash';
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
    gridGroups;
    fundColumns: ColumnDef[]; // = [{ field: '_id', title: 'מספר קופה' }];
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
            const groups = groupBy(this.funds, f => get(f, funds.groupBy));
            this.gridGroups = funds.allGroups.map(g => ({ name: g, count: groups[g] ? groups[g].length : 0 }));
        });
    }
    // @HostListener('window:beforeunload', ['$event']) async unloadHandler() {
    //     window.alert(
    //         'WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.',
    //     );
    //     // const x = this.mfService.unloadHandler();
    //     return 'gfdsdfgfdsfg';
    // }
    filterSelected(userFilter: UserFilter) {
        this.mfService.setSelectedUserFilter(userFilter);
    }
}
