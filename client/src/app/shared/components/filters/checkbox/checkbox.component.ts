import { Component } from '@angular/core';
import { BaseFilterComponent } from '../base.component';

@Component({
  selector: 'p-checkbox',
  template: `
  <div fxLayout="column">
      <span *ngIf="settings.placeholder">{{settings.placeholder}}</span>
      <div fxLayoutAlign="space-between stretch">
            <mat-checkbox *ngFor="let option of settings.options">{{option.name}}</mat-checkbox>
      </div>
</div>
  `
})
export class CheckboxComponent extends BaseFilterComponent {
}
