import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { TextBoxComponent } from './text-box/text-box.component';
import { MaterialModule } from './material/material.module';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './filters/dropdown/dropdown.component';
import { CheckboxComponent } from './filters/checkbox/checkbox.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FilterGroupComponent } from './filters/filter-group/filter-group.component';
import { FilterComponent } from './filters/filter/filter.component';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { TopbarComponent } from './topbar/topbar.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { RouterModule } from '@angular/router';
import { AutocompleteComponent } from './filters/autocomplete/autocomplete.component';
import {TableModule} from './table/table.module';
const components = [
    // TextBoxComponent,
    DropdownComponent,
    CheckboxComponent,
    FilterGroupComponent,
    FilterComponent,
    KeyboardComponent,
    TopbarComponent,
    NavMenuComponent,
    AutocompleteComponent,
];
@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CommonModule,
        FlexLayoutModule,
        RouterModule,
        TableModule
    ],
    declarations: components,
    exports: [TableModule, MaterialModule, FlexLayoutModule].concat(components),
})
export class ComponentsModule { }
