import { Component, Inject, Input, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'p-parameter-picker',
    templateUrl: './parameter-picker.component.html',
    styleUrls: ['./parameter-picker.component.scss'],
})
export class ParameterPickerComponent {
    constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data?) {
        if (data) {
            this.groups = data.groups;
            this.bindingParamterName = data.bindingParamterName || this.bindingParamterName;
            this.childrenPatameterName = data.childrenPatameterName || this.childrenPatameterName;
            this.parameterTitleName = data.parameterTitleName || this.parameterTitleName;
            this.dic = data.dic;
            this.isSmall = data.isSmall;
            this.title = data.title;
        }
    }

    @Input() title: string;
    @Input() groups: any[];
    @Input() dic: any[];
    @Input() childrenPatameterName: string = 'parameters';
    @Input() bindingParamterName: string = 'isActive';
    @Input() parameterTitleName: string = 'name';
    @Input() isSmall: boolean = false;
}
