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
    isOtherSolution = false;
    @Input() set currentSystem(system) {
        this.isOtherSolution = system === 'otherSolution';
        this.imageUrl = `assets/img/systems/` + system + '.png';
    }
    constructor(public i18nService: I18nService) {
        this.i18nService.dic.subscribe(result => {
            this.dic = result as any;
        });
    }
    ngOnInit() {}
}
