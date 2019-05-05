import { Component } from '@angular/core';
import { BaseFilterComponent } from '../base.component';

@Component({
    selector: 'p-checkbox',
    template: `
        <mat-checkbox *ngFor="let option of settings.options">{{
            option.name
        }}</mat-checkbox>
    `,
})
export class CheckboxComponent extends BaseFilterComponent {}
