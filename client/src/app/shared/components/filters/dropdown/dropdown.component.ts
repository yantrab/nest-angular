import { Component } from '@angular/core';
import { BaseFilterComponent } from '../base.component';

@Component({
  selector: 'p-dropdown',
  template: `
<mat-form-field *ngIf="settings">
  <mat-select [value]="settings.selected" [compareWith]="compareFn" [placeholder]="settings.placeholder">
      <mat-option *ngFor="let option of settings.options" [value]="option"> {{option.name}} </mat-option>
  </mat-select>
</mat-form-field>
  `
})
export class DropdownComponent extends BaseFilterComponent {
  compareFn(a, b) {
    return a && b && a.id === b.id;
  }
}
