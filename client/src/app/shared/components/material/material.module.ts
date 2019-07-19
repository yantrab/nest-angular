import {
    MatTabsModule,
    MatGridListModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCardModule,
    MatSlideToggleModule,
    MatTreeModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatChipsModule,
    MatProgressBarModule,
    MatSortModule,
    MatSnackBarModule,
    MatStepperModule,
    MatRadioModule,
    MatDividerModule,
    MatSliderModule,
} from '@angular/material';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Injectable, NgModule } from '@angular/core';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
    NativeDateAdapter,
    SatDatepickerModule,
    SatNativeDateModule,
} from 'saturn-datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { format } from 'date-fns';
import { Platform } from '@angular/cdk/platform';
const modules = [
    MatProgressBarModule,
    MatGridListModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCardModule,
    MatSlideToggleModule,
    MatTreeModule,
    MatTableModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatChipsModule,
    MatSortModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatSnackBarModule,
    ScrollingModule,
    NgxMaterialTimepickerModule,
    MatStepperModule,
    MatRadioModule,
    MatDividerModule,
    MatSliderModule,
];

@Injectable()
export class MyDateAdapter extends NativeDateAdapter {
    constructor(matDateLocale: string) {
        super(matDateLocale, new Platform());
    }
    format(date: Date, displayFormat: any): string {
        return format(date, 'DD/MM/YYYY');
    }
}

@NgModule({
    imports: modules,
    exports: modules,
    providers: [{ provide: DateAdapter, useClass: MyDateAdapter, deps: [MAT_DATE_LOCALE] }],
})
export class MaterialModule {}
