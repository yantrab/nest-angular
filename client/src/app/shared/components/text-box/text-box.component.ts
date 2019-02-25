import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MyErrorStateMatcher } from './MyErrorStateMatcher';

@Component({
  selector: 'p-text-box',
  template: `
  <form [formGroup]="form.parent">
  <mat-form-field [appearance]="appearance">
    <input matInput [placeholder]="placeholder" [formControl]="form" [name]="name" [formControlName]="name"
      [errorStateMatcher]="matcher">
    <mat-hint *ngIf='hint'>{{hint}}</mat-hint>
    <mat-error *ngIf="form.invalid"> {{"validations." + matcher.error}} </mat-error>
  </mat-form-field>
</form>`,
  styles: ['mat-form-field{width: 100%;}']
})
export class TextBoxComponent {
  @Input() form: FormControl;
  @Input() name: string;
  @Input() placeholder = '';
  @Input() hint;
  @Input() appearance = 'outline';
  matcher = new MyErrorStateMatcher();
}
