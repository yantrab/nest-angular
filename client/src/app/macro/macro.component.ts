import { Component, HostListener } from '@angular/core';
import { Category, Series, DataRequest, SeriesGroup, UserSettings } from 'shared/models/macro.model';
import { ColumnDef } from 'mat-virtual-table';
import { MacroController } from 'src/api/macro.controller';
import { ITopBarModel } from '../shared/components/topbar/topbar.interface';
import { I18nService } from '../shared/services/i18n.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { keyBy, first, last, groupBy } from 'lodash';
import { DatePipe } from '@angular/common';
import { XLSXService } from '../shared/services/xlsx.service';
import { AutocompleteFilter } from 'shared';
export const NEW = ' (Create new) ';

@Component({
    selector: 'p-macro',
    templateUrl: './macro.component.html',
    styleUrls: ['./macro.component.scss'],
})
export class MacroComponent {
    constructor(private api: MacroController, public i18nService: I18nService, fb: FormBuilder, private xslService: XLSXService) {
        this.api.getInitialData().then(data => {
            this.categories = data.categories;
            this.allSeries = this.series = data.series;
            this.seriesDic = this.allSeries.reduce((map, series) => {
                map[series.sId] = series;
                return map;
            }, {});
            this.userSettings = data.userSettings;
            this.seriesGroupsSettings.options = this.userSettings.userTemplates;
            this.currentTemplate = this.userSettings.userTemplates[0];
            this.seriesGroupsSettings.selected = this.currentTemplate;
            this.currentTemplate.seriesIds.forEach(id => (this.selectedSeries[id] = true));
        });
        this.dateForm = fb.group({
            date: [{ begin: new Date(2018, 7, 5), end: new Date(2018, 7, 25) }],
        });
    }
    categories: Category[];
    currentTemplate: SeriesGroup;
    series: Series[];
    allSeries: Series[];
    seriesDic: { [_id: string]: Series };
    userSettings: UserSettings;
    id;
    dateForm: FormGroup;

    // User Templates
    seriesGroupsSettings: AutocompleteFilter = new AutocompleteFilter({
        options: [],
        placeholder: 'Select or create new.',
        selected: {},
    });

    columns: ColumnDef[] = [
        { field: 'select', title: ' ', width: '70px', isSortable: false },
        { field: 'name', title: 'שם הסידרה' },
        { field: '_id', title: 'מספר הסדרה' },
        { field: 'hebTypeName', title: 'סוג' },
        { field: 'unitEnName', title: 'יחידות' },
        { field: 'startDate', title: 'תאריך התחלה', width: '100px' },
        { field: 'endDate', title: 'תאריך סוף', width: '100px' },
        { field: 'lastUpdate', title: 'תאריך עידכון', width: '100px' },
    ];
    topbarModel: ITopBarModel = {
        logoutTitle: 'logout',
        routerLinks: [],
        menuItems: [],
    };
    selectedSeries = {};

    onSelectCategory(category?: Category) {
        if (category) {
            this.series = this.allSeries.filter(s => s.sId.startsWith(category.cId));
        } else {
            this.series = this.allSeries;
        }
    }
    onSelectSeries(checked: boolean, series: Series) {
        if (checked) {
            this.currentTemplate.seriesIds.push(series.sId);
            this.selectedSeries[series.sId] = true;
        } else {
            this.currentTemplate.seriesIds = this.currentTemplate.seriesIds.filter(s => s !== series.sId);
            this.selectedSeries[series.sId] = false;
        }
        this.api.saveUserSettings(this.userSettings).then();
    }

    download() {
        const formData: DataRequest = {
            seriesIds: this.currentTemplate.seriesIds,
            from: +this.dateForm.value.date.begin,
            to: +this.dateForm.value.date.end,
        };
        const transform = date => new DatePipe('en').transform(date, 'dd.MM.yyyy');
        this.api.getData(formData).then(result => {
            const types = ['יומי', 'שבועי', 'חודשי', 'רבעוני', 'שנתי'];
            const sheets = [];
            const names: string[] = [];
            const groupByUnitType = groupBy(result, s => this.seriesDic[s.sId].hebTypeName);
            types.forEach(type => {
                const serias = groupByUnitType[type];
                if (!serias) {
                    return;
                }
                const all = {};
                serias.forEach(s => {
                    s.data.forEach(d => {
                        if (!all[d.timeStamp]) {
                            all[d.timeStamp] = {};
                            serias.forEach(s => (all[d.timeStamp][s.sId] = ''));
                        }
                        all[d.timeStamp][s.sId] = d.value;
                    });
                });
                const excelData: any = {};
                excelData.rows = Object.keys(all).map(d => Object.assign({}, { תאריך: new Date(+d) }, all[d]));
                sheets.push(excelData);
                names.push(type);
            });
            if (sheets.length) {
                this.xslService.export(sheets, names, 'macro.xlsx');
            }
        });
    }

    filterSelected(seriesGroup: SeriesGroup) {
        if (!seriesGroup.seriesIds) {
            // seriesGroup.id = this.seriesGroupsSettings.options.length.toString();
            seriesGroup.seriesIds = [];
            seriesGroup.name = seriesGroup.name.replace(NEW, '');
            this.seriesGroupsSettings.options.push(seriesGroup);
        }
        this.currentTemplate = seriesGroup;
        this.selectedSeries = {};
        this.currentTemplate.seriesIds.forEach(id => (this.selectedSeries[id] = true));
    }
}
