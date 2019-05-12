import { Component, OnInit, HostListener } from '@angular/core';
import { Category, Series, DataRequest, SeriesGroup, UserSettings } from 'shared/models/macro.model';
import { ColumnDef } from 'mat-virtual-table';
import { MacroController } from 'src/api/macro.controller';
import { ITopBarModel } from '../shared/components/topbar/topbar.interface';
import { ITreeOptions } from 'angular-tree-component';
import { I18nService } from '../shared/services/i18n.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { keyBy, first, last } from 'lodash';
import { DatePipe } from '@angular/common';
import { XLSXService } from '../shared/services/xlsx.service';
import { AutocompleteFilter } from 'shared';
export const NEW = ' (Create new) ';
import { filterFn } from 'src/app/shared/components/filters/autocomplete/autocomplete.component';

@Component({
    selector: 'p-macro',
    templateUrl: './macro.component.html',
    styleUrls: ['./macro.component.scss'],
})
export class MacroComponent {
    constructor(
        private api: MacroController,
        public i18nService: I18nService,
        fb: FormBuilder,
        private xslService: XLSXService,
    ) {
        this.api.getInitialData().then(data => {
            this.categories = data.categories;
            this.allSerias = this.serias = data.serias;
            this.userSettings = data.userSettings;
            this.seriesGroupsSettings.options = this.userSettings.userTemplates;
            this.currentTemplate = this.userSettings.userTemplates[0];
            this.seriesGroupsSettings.selected = this.currentTemplate;
        });
        this.dateForm = fb.group({
            date: [{ begin: new Date(2018, 7, 5), end: new Date(2018, 7, 25) }],
        });
    }
    categories: Category[];
    selectedCategories: Category[] = [];
    currentTemplate: SeriesGroup;
    // selectedSerias: Series[] = [];
    serias: Series[];
    allSerias: Series[];
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
        //{ field: 'catalogPath', title: 'קטלוג' },
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
    selectedSerias = {};

    filterFn = (options: any[], query: string) => {
        query = query.trim();
        if (query && !this.seriesGroupsSettings.options.find(f => f.name === query)) {
            return [new SeriesGroup({ name: query + NEW })].concat(filterFn(options, query));
        }
        return filterFn(options, query);
    };

    @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
        this.api.saveUserSettings(this.userSettings);
    }

    onSelectCategory(category?: Category) {
        if (category) {
            this.serias = this.allSerias.filter(s => s._id.startsWith(category._id));
        } else {
            this.serias = this.allSerias;
        }
    }
    onSelectSerias(cheked: boolean, series: Series) {
        if (cheked) {
            this.currentTemplate.series.push(series);
            this.selectedSerias[series._id] = true;
        } else {
            this.currentTemplate.series = this.currentTemplate.series.filter(s => s._id !== series._id);
            this.selectedSerias[series._id] = false;
        }
    }

    download() {
        const formData: DataRequest = {
            seriasIds: this.currentTemplate.series.map(k => k._id),
            from: +this.dateForm.value.date.begin,
            to: +this.dateForm.value.date.end,
        };
        const transform = date => new DatePipe('en').transform(date, 'dd.MM.yyyy');
        this.api.getData(formData).then(result => {
            const dic = keyBy(result, r => r._id);
            const sheets = [];
            const names: string[] = [];
            this.currentTemplate.series.forEach(s => {
                const excelData: any = {};
                if (!dic[s._id] || !dic[s._id].data || !dic[s._id].data.length) {
                    return;
                }
                const sData = dic[s._id].data;
                excelData.rows = sData.map(d => ({
                    תאריך: transform(d.timeStamp),
                    ערך: d.value,
                }));
                excelData.description = {};
                excelData.description['סדרה:'] = s._id;
                excelData.description['שם הסדרה'] = s.name;
                excelData.description['סוג נתונים:'] = s.hebTypeName;
                excelData.description['מקור:'] = s.sourceEnName;
                excelData.description['יחידות:'] = s.unitEnName;
                excelData.description['תאריך ראשון:'] = transform(first(sData).timeStamp);
                excelData.description['תאריך אחרון:'] = transform(last(sData).timeStamp);
                sheets.push(excelData);
                names.push(s._id);
            });
            this.xslService.export(sheets, names, 'macro.xlsx');
        });
    }

    filterSelected(seriesGroup: SeriesGroup) {
        if (seriesGroup.isNew) {
            seriesGroup._id = this.seriesGroupsSettings.options.length.toString();
            seriesGroup.series = [];
            seriesGroup.name = seriesGroup.name.replace(NEW, '');
            this.seriesGroupsSettings.options.push(seriesGroup);
        }
    }
}
