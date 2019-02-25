import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextBoxComponent } from './text-box/text-box.component';
import { materialModule } from './material/material.module'
import { CommonModule } from '@angular/common';
@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        materialModule,
        CommonModule
    ],
    declarations: [
        TextBoxComponent
    ],
    exports: [
        TextBoxComponent
    ]
})
export class ComponentsModule { }