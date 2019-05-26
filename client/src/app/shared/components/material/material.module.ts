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
    NativeDateAdapter,
} from '@angular/material';
import { NgModule } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
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
];

export class MyDateAdapter extends MomentDateAdapter {
    private datePipe = new DatePipe(this.locale);
    format(date, displayFormat: string): string {
        return date.format('DD/MM/YYYY');
    }
}

@NgModule({
    imports: modules,
    exports: modules,
    declarations: [],
    providers: [
        { provide: DateAdapter, useClass: MyDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],
})
export class MaterialModule {}
