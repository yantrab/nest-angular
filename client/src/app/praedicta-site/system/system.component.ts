import { Component, Input, OnInit } from '@angular/core';
import { I18nRootObject } from '../../../api/i18n/site.i18n';
import { I18nService } from '../../shared/services/i18n.service';

@Component({
    selector: 'p-system',
    templateUrl: './system.component.html',
    styleUrls: ['./system.component.scss'],
})
export class SystemComponent implements OnInit {
    dic: I18nRootObject;
    // currentSystem: string;
    @Input() systemName: string = '';
    @Input() isHover: boolean = false;

    // @Output() changeSystem = new EventEmitter();

    constructor(public i18nService: I18nService) {
        this.i18nService.dic.subscribe(result => {
            this.dic = result as any;
        });
    }

    ngOnInit() {}

    // onClick(e){
    // debugger;
    //   this.changeSystem.emit("holdings");

    // }
}
