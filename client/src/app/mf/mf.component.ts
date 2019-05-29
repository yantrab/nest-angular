import { Component } from '@angular/core';
import { ITopBarModel } from '../shared/components/topbar/topbar.interface';
import { I18nService } from '../shared/services/i18n.service';
import { I18nRootObject } from '../../api/i18n/mf.i18n';
@Component({
    selector: 'mf-root',
    template: `
        <div [dir]="i18nService.dir">
            <p-topbar [inProgress]="" [model]="topbarModel"></p-topbar>
            <div class="content"><router-outlet></router-outlet></div>
        </div>
    `,
    styleUrls: ['mf.component.scss'],
})
export class MFComponent {
    constructor(public i18nService: I18nService) {
        this.i18nService.dic.subscribe(result => (this.dic = result as any));
    }

    dic: I18nRootObject;
    topbarModel: ITopBarModel = {
        logoutTitle: 'logout',
        routerLinks: [{ link: 'findFund', title: 'linkToPoly' }, { link: 'dumy', title: 'linkToDumy' }],
        menuItems: [],
    };
}
