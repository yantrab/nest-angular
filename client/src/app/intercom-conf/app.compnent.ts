import { Component } from '@angular/core';
import { I18nService } from '../shared/services/i18n.service';
import { AuthService } from '../auth/auth.service';
import { ITopBarModel } from '../shared/components/topbar/topbar.interface';
import { App } from 'shared';

@Component({
    selector: 'p-root',
    template: `
        <div [dir]="i18nService.dir">
            <p-topbar [model]="topbarModel" [inProgress]="inProgress"></p-topbar>
            <router-outlet></router-outlet>
        </div>
    `,
})
export class AppComponent {
    constructor(public i18nService: I18nService, private authService: AuthService) {
        authService.getUserAuthenticated().then(user => {
            if(user.hasPermission(App.admin)) {
                this.topbarModel.routerLinks.push( {title: 'users', link: 'admin'})
            }
        })
    }
    inProgress = false;
    topbarModel: ITopBarModel = {
        logoutTitle: 'logout',
        routerLinks: [{title: 'panels', link: 'panels'}],
        menuItems: [],
        logout: () => this.authService.logout()
    };
}
