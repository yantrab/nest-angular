import { Component, KeyValueDiffers } from '@angular/core';
import { BaseFilterComponent } from '../base.component';

@Component({
    selector: 'p-dropdown',
    template: `
        <mat-form-field *ngIf="settings">
            <mat-select
                (selectionChange)="optionSelected($event.value)"
                [value]="settings.selected"
                [compareWith]="compareFn"
                [placeholder]="placeholder"
            >
                <mat-option *ngFor="let option of settings.options" [value]="option">
                    {{ option.name }}
                </mat-option>
            </mat-select>
        </mat-form-field>
    `,
})
export class DropdownComponent extends BaseFilterComponent {
    constructor(differs: KeyValueDiffers) {
        super(differs);
    }
    compareFn(a, b) {
        return a && b && a.id === b.id;
    }
}
