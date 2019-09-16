import { Component } from '@angular/core';
import { ITopBarModel } from '../shared/components/topbar/topbar.interface';
import { I18nService } from '../shared/services/i18n.service';
import { I18nRootObject } from '../../api/i18n/mf.i18n';
import { MfService } from './mf.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';
@Component({
    selector: 'mf-root',
    template: `
        <div [dir]="i18nService.dir" *ngIf="topbarModel">
            <p-topbar [inProgress]="inProgress" [model]="topbarModel"></p-topbar>
            <div *ngIf="!inProgress" class="content"><router-outlet></router-outlet></div>
        </div>
    `,
    styleUrls: ['mf.component.scss'],
})
export class MFComponent {
    constructor(
        public i18nService: I18nService,
        private mfService: MfService,
        private titleService: Title,
        private authService: AuthService,
    ) {
        this.titleService.setTitle('Praedicta | קרנות נאמנות');
        mfService.funds.subscribe(() => {
            this.inProgress = false;
        });
        this.i18nService.dic.subscribe(result => {
            this.dic = result as any;
            this.topbarModel = {
                logoutTitle: this.dic.topbar.logout,
                logout: () => this.authService.logout(),
                routerLinks: [
                    { link: 'find', title: this.dic.topbar.link1 },
                    { link: 'simulation', title: this.dic.topbar.link2 },
                ],
                menuItems: [],
            };
        });
    }
    inProgress = true;
    dic: I18nRootObject;
    topbarModel: ITopBarModel;
}
