import { Component, OnInit } from '@angular/core';
import { Category, Series } from '../../../../shared/models/macro.model';
import { BehaviorSubject } from 'rxjs';
import { ColumnDef } from 'mat-virtual-table';
import { MacroController } from 'src/api/macro.controller';
import { ITopBarModel } from '../shared/components/topbar/topbar.interface';
import { ITreeOptions } from 'angular-tree-component';
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
  treeOptions: ITreeOptions = { idField: 'CatgID', displayField: 'NameHebrew'};
  columns: ColumnDef[] = [
    { field: 'hebName', title: 'שם הסידרה' },
    { field: 'catalogPath', title: 'קטלוג' },
    { field: 'id', title: 'מספר הסדרה' },
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
  constructor(private api: MacroController) {
    this.api.getInitialData().then(data => {
      this.categories = data.categories;
      this.allSerias = this.serias = data.serias;
    });
  }

  ngOnInit() {
  }

  onSelectCategory(category: Category) {
    if (this.selectedCategories.find(s => s.CatgID === category.CatgID)) {
      this.selectedCategories = this.selectedCategories.filter(s => s.CatgID !== category.CatgID);
    } else {
      this.selectedCategories.push(category);
    }


    if (this.selectedCategories) {
      this.serias = this.allSerias.filter(s => this.selectedCategories.find(c => c.CatgID === s.id));
    } else {
      this.serias = this.allSerias;
    }

  }
}
