import {
    MatInputModule, MatFormFieldModule, MatMenuModule, MatButtonModule, MatIconModule,
    MatAutocompleteModule, MatSelectModule, MatCardModule, MatSlideToggleModule, MatTreeModule,
    MatCheckboxModule, MatExpansionModule, MatChipsModule
  } from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [MatInputModule, MatFormFieldModule, MatMenuModule, MatButtonModule,
      MatIconModule, MatAutocompleteModule, MatSelectModule, MatCardModule, MatSlideToggleModule, MatTreeModule,
      MatCheckboxModule, MatExpansionModule, MatChipsModule],
    exports: [MatInputModule, MatFormFieldModule, MatMenuModule, MatButtonModule,
      MatIconModule, MatAutocompleteModule, MatSelectModule, MatCardModule, MatSlideToggleModule, MatTreeModule,
      MatCheckboxModule, MatExpansionModule, MatChipsModule],
    declarations: [],
  })
  export class materialModule { }

