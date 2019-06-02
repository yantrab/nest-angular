import { Component, Input, OnInit } from '@angular/core';
import { I18nService } from '../../shared/services/i18n.service';
import { I18nRootObject } from '../../../api/i18n/site.i18n';

@Component({
    selector: 'p-image',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
    dic: I18nRootObject;
    imageUrl: string;
    @Input() currentSystem: string;
    constructor(public i18nService: I18nService) {
        this.i18nService.dic.subscribe(result => {
            this.dic = result as any;
        });
    }
    ngOnInit() {
        debugger;
        this.imageUrl = `assets/img/systems/${this.currentSystem}.PNG`;
    }
}
