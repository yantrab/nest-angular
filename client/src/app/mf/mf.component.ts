import { Component } from '@angular/core';
import { ITopBarModel } from '../shared/components/topbar/topbar.interface';
@Component({
    selector: 'mf-root',
    template: `
        <p-topbar [model]="topbarModel"></p-topbar>
        <div class="content"><router-outlet></router-outlet></div>
    `,
    styleUrls: ['mf.component.scss'],
})
export class MFComponent {
    topbarModel: ITopBarModel = {
        logoutTitle: 'logout',
        routerLinks: [
            { link: 'poly', title: 'linkToPoly' },
            { link: 'dumy', title: 'linkToDumy' },
        ],
        menuItems: [],
    };
}
