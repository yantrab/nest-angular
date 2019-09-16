/* tslint:disable:no-string-literal */
import { Component, ViewEncapsulation } from '@angular/core';
import { Category, Series, DataRequest, SeriesGroup, UserSettings } from 'shared/models/macro.model';
import { ColumnDef } from 'mat-virtual-table';
import { MacroController } from 'src/api/macro.controller';
import { I18nService } from '../shared/services/i18n.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { groupBy, max, orderBy } from 'lodash';
import { XLSXService } from '../shared/services/xlsx.service';
import { AutocompleteFilter } from 'shared';
import { map, startWith } from 'rxjs/operators';
import { addYears, format } from 'date-fns';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
//
@Component({
    selector: 'p-macro',
    templateUrl: './macro.component.html',
    styleUrls: ['./macro.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MacroComponent {
    NEW = ' (צור תבנית חדשה) ';
    isOpen = false;
    input: FormControl = new FormControl();
    filteredOptions: Observable<Series[]>;
    stopFlagIndex = -1;
    private queries = [];
    private filter = (value: any): Series[] => {
        if (!value || typeof value !== 'string') {
            return orderBy(this.series, 'sId');
        }
        const query = ' ' + value.toLowerCase();
        const result = orderBy(this.queries.filter(q => q.queries.includes(query)).map(q => q.option), ['isStopped', 'sId']);
        this.stopFlagIndex = result.findIndex(r => r.isStopped);
        return result;
    };

    constructor(
        private api: MacroController,
        public i18nService: I18nService,
        fb: FormBuilder,
        private xslService: XLSXService,
        private titleService: Title,
    ) {
        this.titleService.setTitle('Praedicta | Macro');
        this.api.getInitialData().then(data => {
            this.categories = data.categories;
            this.allSeries = this.series = data.series;
            this.seriesDic = this.allSeries.reduce((map, series) => {
                map[series.sId] = series;
                return map;
            }, {});
            this.userSettings = data.userSettings;
            //if (!this.userSettings.userTemplates[0]) {
            //   this.userSettings.userTemplates.push(new SeriesGroup({ name: 'טמפלט' }));
            // }
            this.seriesGroupsSettings.options = this.userSettings.userTemplates;
            this.currentTemplate = new SeriesGroup({ name: 'טמפלט', seriesIds: [] }); //this.userSettings.userTemplates[0];
            // this.seriesGroupsSettings.selected = this.currentTemplate;
            this.currentTemplate.seriesIds.forEach(id => (this.selectedSeries[id] = true));

            this.allSeries.forEach(option => {
                this.queries.push({
                    q: ['sId', 'name', 'startDate', 'endDate']
                        .reduce((query, path) => query + ' ' + (option[path] || ''), '')
                        .toLowerCase(),
                    option,
                });
            });
            const maxDate = max(this.allSeries.map(s => s.endDate));
            this.dateForm = fb.group({
                date: [{ begin: new Date(addYears(maxDate, -5)), end: new Date(maxDate) }],
            });
        });

        this.filteredOptions = this.input.valueChanges.pipe(
            startWith<string | any>(''),
            map(name => this.filter(name)),
        );
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
        placeholder: 'חפש / צור תבנית',
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
    selectedSeries = {};

    onSelectCategory(category?: Category) {
        if (category) {
            this.series = this.allSeries.filter(s => s.sId.startsWith(category.cId));
        } else {
            this.series = this.allSeries;
        }
        this.input.setValue('');
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
    changeDirection() {
        this.i18nService.language = this.i18nService.language === 'he' ? 'en' : 'he';
    }
    download() {
        const formData: DataRequest = {
            seriesIds: this.currentTemplate.seriesIds,
            from: +this.dateForm.value.date.begin,
            to: +this.dateForm.value.date.end,
        };
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
                serias
                    .filter(s => s.data.length)
                    .forEach(s => {
                        s.data.forEach(d => {
                            const name = this.seriesDic[s.sId].name;
                            if (!all[d.timeStamp]) {
                                all[d.timeStamp] = {};
                                all[d.timeStamp][s.sId + ' - ' + name] = '';
                            }
                            all[d.timeStamp][s.sId + ' - ' + name] = d.value;
                        });
                    });
                const excelData: any = {};
                excelData.rows = Object.keys(all).map(d => Object.assign({}, { תאריך: new Date(+d) }, all[d]));
                sheets.push(excelData);
                names.push(type);
            });
            if (sheets.length) {
                sheets.unshift({
                    rows: this.currentTemplate.seriesIds.map(id => {
                        const serie = this.seriesDic[id];
                        const item: any = {};
                        item['קטלוג'] = serie.catalogPath;
                        item['שם הסדרה'] = serie.name;
                        item['תאריך התחלה'] = new Date(serie.startDate);
                        item['תאריך סיום'] = new Date(serie.endDate);
                        item['עדכון אחרון'] = new Date(serie.lastUpdate);
                        item['סדרה לא פעילה'] = serie.isStopped;
                        item['תקופה'] = serie.hebTypeName;
                        item['יחידה'] = serie.unitEnName;
                        return item;
                    }),
                });
                names.unshift('פרטי הסדרות');

                this.xslService.export(sheets, names, 'macro_' + format(new Date(), 'dd.MM.yyyy') + '.xlsx');
            }
        });
    }

    filterSelected(seriesGroup: SeriesGroup) {
        if (!seriesGroup.seriesIds) {
            // seriesGroup.id = this.seriesGroupsSettings.options.length.toString();
            seriesGroup.seriesIds = [];
            seriesGroup.name = seriesGroup.name.replace(this.NEW, '');
            this.seriesGroupsSettings.options.push(seriesGroup);
            this.api.saveUserSettings(this.userSettings).then();
        }
        this.currentTemplate = seriesGroup;
        this.selectedSeries = {};
        this.currentTemplate.seriesIds.forEach(id => (this.selectedSeries[id] = true));
    }
    onRemoveOption(option) {
        this.seriesGroupsSettings.options = this.userSettings.userTemplates = this.userSettings.userTemplates.filter(
            o => option.name !== o.name,
        );
        this.api.saveUserSettings(this.userSettings).then();
    }
}
