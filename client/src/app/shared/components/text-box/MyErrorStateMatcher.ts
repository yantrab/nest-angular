import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  error: string;
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    if (control && control.invalid) {
      this.error = control.errors[0];
    }
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
