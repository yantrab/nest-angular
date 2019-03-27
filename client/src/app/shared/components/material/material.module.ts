import {
  MatTabsModule,
  MatGridListModule,
  MatTableModule,
  MatInputModule, MatFormFieldModule, MatMenuModule, MatButtonModule, MatIconModule,
  MatAutocompleteModule, MatSelectModule, MatCardModule, MatSlideToggleModule, MatTreeModule,
  MatCheckboxModule, MatExpansionModule, MatChipsModule
} from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [MatGridListModule, MatInputModule, MatFormFieldModule, MatMenuModule, MatButtonModule, MatTabsModule,
    MatIconModule, MatAutocompleteModule, MatSelectModule, MatCardModule, MatSlideToggleModule, MatTreeModule, MatTableModule,
    MatCheckboxModule, MatExpansionModule, MatChipsModule],
  exports: [MatGridListModule, MatInputModule, MatFormFieldModule, MatMenuModule, MatButtonModule,
    MatIconModule, MatAutocompleteModule, MatSelectModule, MatCardModule, MatSlideToggleModule, MatTreeModule, MatTableModule,
    MatCheckboxModule, MatExpansionModule, MatChipsModule, MatTabsModule],
  declarations: [],
})
export class MaterialModule { }
