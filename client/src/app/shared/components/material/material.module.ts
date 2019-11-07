import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTreeModule } from '@angular/material/tree';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
    MatDialogModule,
];

// @Injectable()
// export class MyDateAdapter extends NativeDateAdapter {
//     constructor(matDateLocale: string) {
//         super(matDateLocale, new Platform());
//     }
//     format(date: Date, displayFormat: any): string {
//         return format(date, 'dd/MM/yyyy');
//     }
// }

@NgModule({
    imports: modules,
    exports: modules,
    //providers: [{ provide: DateAdapter, useClass: MyDateAdapter, deps: [MAT_DATE_LOCALE] }],
})
export class MaterialModule {}
