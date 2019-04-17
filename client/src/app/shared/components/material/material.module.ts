import {
  MatTabsModule,
  MatGridListModule,
  MatTableModule,
  MatInputModule,
  MatFormFieldModule,
  MatMenuModule,
  MatButtonModule,
  MatIconModule,
  MatAutocompleteModule, MatSelectModule, MatCardModule, MatSlideToggleModule, MatTreeModule,
  MatCheckboxModule, MatExpansionModule, MatChipsModule,
  MatProgressBarModule,
  MatSortModule,
} from '@angular/material';
import { NgModule } from '@angular/core';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
const modules = [MatProgressBarModule, MatGridListModule, MatInputModule, MatFormFieldModule, MatMenuModule, MatButtonModule, MatTabsModule,
  MatIconModule, MatAutocompleteModule, MatSelectModule, MatCardModule, MatSlideToggleModule, MatTreeModule, MatTableModule,
  MatCheckboxModule, MatExpansionModule, MatChipsModule, MatSortModule, SatDatepickerModule, SatNativeDateModule]
@NgModule({
  imports: modules,
  exports: modules,
  declarations: [],
})
export class MaterialModule { }
