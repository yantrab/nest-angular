import { Component, OnInit } from '@angular/core';
import { Category, Series } from '../../../../shared/models/macro.model';
import { BehaviorSubject } from 'rxjs';
import { ColumnDef } from 'mat-virtual-table';
import { MacroController } from 'src/api/macro.controller';
import { ITopBarModel } from '../shared/components/topbar/topbar.interface';
import { ITreeOptions } from 'angular-tree-component';
import { I18nService } from '../shared/services/i18n.service';
@Component({
  selector: 'p-macro',
  templateUrl: './macro.component.html',
  styleUrls: ['./macro.component.scss']
})
export class MacroComponent implements OnInit {
  categories: Category[];
  selectedCategories: Category[] = [];
  selectedSerias: Series[];
  serias: Series[];
  allSerias: Series[];
  tadleDataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  id;
  treeOptions: ITreeOptions;
  columns: ColumnDef[] = [
    { field: 'name', title: 'שם הסידרה' },
    { field: 'catalogPath', title: 'קטלוג' },
    { field: '_id', title: 'מספר הסדרה' },
    { field: 'hebTypeName', title: 'סוג' },
    { field: 'startDate', title: 'תאריך התחלה' },
    { field: 'endDate', title: 'תאריך סוף' },
    { field: 'unitEnName', title: 'יחידות' },
    { field: 'sourceEnName', title: 'מקור נתונים' },
  ];
  // from = addMonths(new Date(), -1);
  // to = new Date();
  topbarModel: ITopBarModel = {
    logoutTitle: 'logout',
    routerLinks: [
    ],
    menuItems: []
  };
  constructor(private api: MacroController, private i18nService: I18nService) {
    this.treeOptions = { idField: '_id', displayField: 'name', rtl: this.i18nService.dir === 'rtl' };
    this.api.getInitialData().then(data => {
      this.categories = data.categories;
      this.allSerias = this.serias = data.serias;
    });
  }

  ngOnInit() {
  }

  onSelectCategory(category?: Category) {
    if (category) {
      this.serias = this.allSerias.filter(s =>  s._id.startsWith(category._id));
    } else {
      this.serias = this.allSerias;
    }
  }
}
