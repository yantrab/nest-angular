import { Component, Inject, Input, Optional, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DynaFormBuilder, validateAllFields } from 'ng-dyna-form';
import { FormGroup } from '@angular/forms';

export interface FormModel<T> {
    modelConstructor: new (model: T) => any;
    model: Partial<T>;
    feilds: Array<{ key: keyof T; placeHolder: string; appearance?: 'legacy ' | 'standard' | 'fill' | 'outline ' }>;
    appearance?: 'legacy ' | 'standard' | 'fill' | 'outline ';
}

@Component({
    selector: 'p-form-sss',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
    form: FormGroup;
    @Input() formModel: FormModel<any>;
    constructor(
        @Optional() public dialogRef: MatDialogRef<FormComponent>,
        private dynaFB: DynaFormBuilder,
        @Inject(MAT_DIALOG_DATA) private data: FormModel<any>,
    ) {
        if (data) {
            this.formModel = data;
        }
    }
    ngOnInit(): void {
        this.dynaFB.buildFormFromClass(this.formModel.modelConstructor, this.formModel.model).then(form => (this.form = form));
    }

    save(e) {
        // On case that there is no changes in form
        validateAllFields(this.form);
        if (this.form.valid) {
            for (const key in this.form.value) {
                if (this.form.value[key] == null) {
                    delete this.form.value[key];
                }
            }
            this.dialogRef.close(this.form.value);
        }
        e.preventDefault();
    }
    cancel() {
        this.dialogRef.close();
    }
}
