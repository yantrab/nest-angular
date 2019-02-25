import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextBoxComponent } from './text-box/text-box.component';
import { materialModule } from './material/material.module';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './filters/dropdown/dropdown.component';
import { CheckboxComponent } from './filters/checkbox/checkbox.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FilterGroupComponent } from './filters/filter-group/filter-group.component';
import { FilterComponent } from './filters/filter/filter.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        materialModule,
        CommonModule,
        FlexLayoutModule,
    ],
    declarations: [
        TextBoxComponent,
        DropdownComponent,
        CheckboxComponent,
        FilterGroupComponent,
        FilterComponent,
    ],
    exports: [
        TextBoxComponent,
        DropdownComponent,
        FlexLayoutModule
    ]
})
export class ComponentsModule { }
