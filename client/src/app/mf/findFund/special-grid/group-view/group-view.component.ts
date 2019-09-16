import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'p-group-view',
    templateUrl: './group-view.component.html',
    styleUrls: ['./group-view.component.scss'],
})
export class GroupViewComponent {
    constructor(
        public dialogRef: MatDialogRef<GroupViewComponent>,
        @Inject(MAT_DIALOG_DATA) public model: { group: any; columnsDef: any },
    ) {}
}
