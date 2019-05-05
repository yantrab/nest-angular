import { Component, OnInit } from '@angular/core';
import { Category, Series, DataRequest } from 'shared/models/macro.model';
import { BehaviorSubject } from 'rxjs';
import { ColumnDef } from 'mat-virtual-table';
import { MacroController } from 'src/api/macro.controller';
import { ITopBarModel } from '../shared/components/topbar/topbar.interface';
import { ITreeOptions } from 'angular-tree-component';
import { I18nService } from '../shared/services/i18n.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { keyBy, first, last } from 'lodash';
import { DatePipe } from '@angular/common';
import { XLSXService } from '../shared/services/xlsx/xlsx.service';
@Component({
    selector: 'p-macro',
    templateUrl: './macro.component.html',
    styleUrls: ['./macro.component.scss'],
})
export class MacroComponent implements OnInit {
    categories: Category[];
    selectedCategories: Category[] = [];
    selectedSerias: Series[] = [];
    serias: Series[];
    allSerias: Series[];
    tadleDataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    id;
    dateForm: FormGroup;

    treeOptions: ITreeOptions;
    columns: ColumnDef[] = [
        { field: 'select', title: ' ', width: '70px', isSortable: false },
        { field: 'name', title: 'שם הסידרה' },
        { field: 'catalogPath', title: 'קטלוג' },
        { field: '_id', title: 'מספר הסדרה' },
        { field: 'hebTypeName', title: 'סוג' },
        { field: 'startDate', title: 'תאריך התחלה', width: '100px' },
        { field: 'endDate', title: 'תאריך סוף', width: '100px' },
        { field: 'unitEnName', title: 'יחידות' },
    ];
    // from = addMonths(new Date(), -1);
    // to = new Date();
    topbarModel: ITopBarModel = {
        logoutTitle: 'logout',
        routerLinks: [],
        menuItems: [],
    };
    constructor(
        private api: MacroController,
        public i18nService: I18nService,
        fb: FormBuilder,
        private xslService: XLSXService
    ) {
        this.treeOptions = {
            idField: '_id',
            displayField: 'name',
            rtl: this.i18nService.dir === 'rtl',
        };
        this.api.getInitialData().then(data => {
            this.categories = data.categories;
            this.allSerias = this.serias = data.serias;
        });
        this.dateForm = fb.group({
            date: [{ begin: new Date(2018, 7, 5), end: new Date(2018, 7, 25) }],
        });
    }

    ngOnInit() {}

    onSelectCategory(category?: Category) {
        if (category) {
            this.serias = this.allSerias.filter(s =>
                s._id.startsWith(category._id)
            );
        } else {
            this.serias = this.allSerias;
        }
    }
    onSelectSerias(cheked: boolean, series: Series) {
        if (cheked) {
            this.selectedSerias.push(series);
        } else {
            this.selectedSerias = this.selectedSerias.filter(
                s => s._id === series._id
            );
        }
    }
    download() {
        const formData: DataRequest = {
            seriasIds: this.selectedSerias.map(k => k._id),
            from: +this.dateForm.value.date.begin,
            to: +this.dateForm.value.date.end,
        };
        const transform = date =>
            new DatePipe('en').transform(date, 'dd.MM.yyyy');
        this.api.getData(formData).then(result => {
            const dic = keyBy(result, r => r._id);
            const sheets = [];
            const names: string[] = [];
            this.selectedSerias.forEach(s => {
                const excelData: any = {};
                if (
                    !dic[s._id] ||
                    !dic[s._id].data ||
                    !dic[s._id].data.length
                ) {
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
                excelData.description['תאריך ראשון:'] = transform(
                    first(sData).timeStamp
                );
                excelData.description['תאריך אחרון:'] = transform(
                    last(sData).timeStamp
                );
                sheets.push(excelData);
                names.push(s._id);
            });
            this.xslService.export(sheets, names, 'macro.xlsx');
        });
    }
}
