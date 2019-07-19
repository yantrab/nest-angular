import { Component, KeyValueDiffers, OnInit } from '@angular/core';
import { BaseFilterComponent } from '../base.component';

@Component({
    selector: 'p-checkbox',
    template: `
        <div fxLayout="column">
            <span>{{ placeholder }}</span>
            <mat-checkbox
                fxFlex="30px"
                *ngFor="let option of settings.options"
                [checked]="checkedList[option._id] && settings.isActive"
                (change)="change($event.checked, option)"
                color="primary"
                >{{ option.name }}</mat-checkbox
            >
        </div>
    `,
})
export class CheckboxComponent extends BaseFilterComponent implements OnInit {
    checkedList: any = {};
    constructor(differs: KeyValueDiffers) {
        super(differs);
    }

    change(checked, option) {
        if (!this.settings.isActive) {
            this.checkedList = {};
        }
        this.checkedList[option._id] = checked;

        if (!checked) {
            this.optionDeSelected(option);
        } else {
            this.optionSelected(option);
        }
    }

    ngOnInit(): void {
        if (this.settings.selected) {
            this.settings.selected.forEach(s => (this.checkedList[s._id] = true));
        }
    }
}
