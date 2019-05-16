import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { LoginRequest, User } from 'shared/models';
import { DynaFormBuilder, validateAllFields } from 'ng-dyna-form';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'p-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent {
    form: FormGroup;
    constructor(
        public dialogRef: MatDialogRef<EditUserComponent>,
        @Inject(MAT_DIALOG_DATA) public user: User,
        private dynaFB: DynaFormBuilder,
    ) {
        this.dynaFB.buildFormFromClass(User, user).then(form => (this.form = form));
    }

    save(e) {
        // On case that there is no changes in form
        validateAllFields(this.form);
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
        e.preventDefault();
    }
    cancel() {
        this.dialogRef.close();
    }
}
