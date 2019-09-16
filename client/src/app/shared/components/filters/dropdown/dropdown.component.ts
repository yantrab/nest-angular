import { Component, Input, KeyValueDiffers } from '@angular/core';
import { BaseFilterComponent } from '../base.component';

@Component({
    selector: 'p-dropdown',
    template: `
        <mat-form-field style="width: 100%;" *ngIf="settings" floatLabel="always" [appearance]="appearance">
            <mat-label *ngIf="title">{{ title }}</mat-label>
            <mat-select
                [multiple]="settings.isMultiple"
                (selectionChange)="optionSelected($event.value)"
                [value]="settings.selected"
                [compareWith]="compareFn"
                [placeholder]="placeholder"
            >
                <mat-option *ngFor="let option of options" [value]="option">
                    {{ option.name }}
                </mat-option>
            </mat-select>
        </mat-form-field>
    `,
    styles: [':host {width: 100%}'],
})
export class DropdownComponent extends BaseFilterComponent {
    @Input() appearance = 'outline';
    constructor(differs: KeyValueDiffers) {
        super(differs);
    }
    compareFn(a, b) {
        return a && b && a.id === b.id;
    }
}
