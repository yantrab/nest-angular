import { Injectable, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynaFormModule } from 'ng-dyna-form';
import { MaterialModule } from './material/material.module';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './filters/dropdown/dropdown.component';
import { CheckboxComponent } from './filters/checkbox/checkbox.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FilterComponent } from './filters/filter/filter.component';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { TopbarComponent } from './topbar/topbar.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { RouterModule } from '@angular/router';
import { AutocompleteComponent } from './filters/autocomplete/autocomplete.component';
import { TableComponent, TableModule } from 'mat-virtual-table';
import { I18nService } from '../services/i18n.service';
import { XLSXService } from '../services/xlsx.service';
import { TreeComponent } from './tree/tree.component';
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginatorIntl } from '@angular/material';
import { QuantityFilterComponent } from './filters/quantity-filter/quantity-filter.component';
import { DxRangeSelectorModule } from 'devextreme-angular';
import { SpecialFilterComponent } from './filters/special-filter/special-filter.component';
import { ComboboxComponent } from './filters/combobox/combobox.component';
import { ParameterPickerComponent } from './parameter-picker/parameter-picker.component';
import { MultiSliderRangeSelectorComponent } from './multi-slider-range-selector/multi-slider-range-selector.component';
import { DialogService } from '../services/dialog.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormComponent } from './form/form.component';

const components = [
    DropdownComponent,
    CheckboxComponent,
    QuantityFilterComponent,
    FilterComponent,
    KeyboardComponent,
    TopbarComponent,
    NavMenuComponent,
    AutocompleteComponent,
    TreeComponent,
    SpecialFilterComponent,
    ComboboxComponent,
    MultiSliderRangeSelectorComponent,
    ParameterPickerComponent,
    FormComponent,
];

const exportsM = [
    TableModule,
    MaterialModule,
    FlexLayoutModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynaFormModule,
    DxRangeSelectorModule,
    AngularSvgIconModule,
    ...components,
];
@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
    base = new MatPaginatorIntl();

    set nextPageLabel(val) {}

    get nextPageLabel() {
        if (window.getComputedStyle(document.getElementsByTagName('mat-virtual-table')[0]).direction !== 'rtl') {
            return this.base.nextPageLabel;
        }
        return 'הבא';
    }

    set previousPageLabel(val) {}

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
        DynaFormModule,
        DxRangeSelectorModule,
    ],
    declarations: components,
    exports: exportsM,
    providers: [
        I18nService,
        XLSXService,
        { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
        DialogService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
    ],
    entryComponents: [ParameterPickerComponent, TableComponent, FormComponent],
})
export class ComponentsModule {}
