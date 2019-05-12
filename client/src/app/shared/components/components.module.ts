import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DynaFormModule} from 'ng-dyna-form';
// import { TextBoxComponent } from './text-box/text-box.component';
import {MaterialModule} from './material/material.module';
import {CommonModule} from '@angular/common';
import {DropdownComponent} from './filters/dropdown/dropdown.component';
import {CheckboxComponent} from './filters/checkbox/checkbox.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FilterGroupComponent} from './filters/filter-group/filter-group.component';
import {FilterComponent} from './filters/filter/filter.component';
import {KeyboardComponent} from './keyboard/keyboard.component';
import {TopbarComponent} from './topbar/topbar.component';
import {NavMenuComponent} from './nav-menu/nav-menu.component';
import {RouterModule} from '@angular/router';
import {AutocompleteComponent} from './filters/autocomplete/autocomplete.component';
import {TableModule} from 'mat-virtual-table';
import {I18nService} from '../services/i18n.service';
import {XLSXService} from '../services/xlsx.service';
import {TreeComponent} from './tree/tree.component';
import {MatPaginatorIntl} from '@angular/material';

const components = [
    DropdownComponent,
    CheckboxComponent,
    FilterGroupComponent,
    FilterComponent,
    KeyboardComponent,
    TopbarComponent,
    NavMenuComponent,
    AutocompleteComponent,
    TreeComponent,
];

const exportsM = [
    TableModule,
    MaterialModule,
    FlexLayoutModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynaFormModule,
    ...components,
];

class CustomMatPaginatorIntl extends MatPaginatorIntl {
    base = new MatPaginatorIntl();

    set nextPageLabel(val) {
    }

    get nextPageLabel() {
        if (window.getComputedStyle(document.getElementsByTagName('mat-virtual-table')[0]).direction !== 'rtl') {
            return this.base.nextPageLabel;
        }
        return 'הבא';
    }

    set previousPageLabel(val) {
    }

    get previousPageLabel() {
        if (window.getComputedStyle(document.getElementsByTagName('mat-virtual-table')[0]).direction !== 'rtl') {
            return this.base.previousPageLabel;
        }
        return 'קודם';
    }

    getRangeLabel = (page, pageSize, length) => {
        if (window.getComputedStyle(document.getElementsByTagName('mat-virtual-table')[0]).direction !== 'rtl') {
            return this.base.getRangeLabel(page, pageSize, length);
        }
        if (length === 0 || pageSize === 0) {
            return '0 מתוך ' + length;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return startIndex + 1 + ' - ' + endIndex + ' מתוך ' + length;
    };
}

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CommonModule,
        FlexLayoutModule,
        RouterModule,
        TableModule,
        DynaFormModule
    ],
    declarations: components,
    exports: exportsM,
    providers: [I18nService, XLSXService, {provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl}],
})
export class ComponentsModule {
}
