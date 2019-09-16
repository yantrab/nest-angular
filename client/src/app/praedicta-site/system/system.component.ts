import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { I18nRootObject } from '../../../api/i18n/site.i18n';
import { I18nService } from '../../shared/services/i18n.service';
import color_box from 'devextreme/ui/color_box';

@Component({
    selector: 'p-system',
    templateUrl: './system.component.html',
    styleUrls: ['./system.component.scss'],
})
export class SystemComponent implements OnInit {
    dic: I18nRootObject;
    dir;
    value;
    settings;

    @Input() model: {
        systemName: string;
        hoverbackground: string;
        colorCircle: string;
        cyCircle: string;
        cxCircleEng: string;
        cxCircleHe: string;
        // cxCircleHe :string;
    };
    @Input() hover: boolean = false;

    _ishover = false;
    get isHover() {
        return this._ishover;
    }

    set isHover(val) {
        console.log(val);
        this._ishover = val;
    }

    // @Output() changeSystem = new EventEmitter();

    constructor(public i18nService: I18nService) {
        this.i18nService.dic.subscribe(result => {
            this.dic = result as any;
            this.dir = this.i18nService.dir;
            this.value = this.dir === 'ltr' ? '10' : '-10';
        });
    }

    ngOnInit() {}

    // onClick(e){
    // debugger;
    //   this.changeSystem.emit("holdings");

    // }

    getPositionClass() {
        if (this.model.systemName === 'contactUs' || this.model.systemName === 'holdings') {
            return 'top';
        }
        return 'bottom';
    }
}
