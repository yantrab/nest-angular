import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  error: string;
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    if (control && control.invalid) {
      this.error = control.errors[0];
      //Object.keys(control.errors).filter(key => control.errors[key])[0];
    }
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'p-text-box',
  templateUrl: './text-box.component.html',
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
