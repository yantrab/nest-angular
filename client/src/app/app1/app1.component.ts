import { Component } from '@angular/core';
import { ITopBarModel } from '../shared/components/topbar/topbar.interface';
@Component({
  selector: 'app1-root',
  template: `
  <p-topbar [model]="topbarModel"></p-topbar>
  <router-outlet ></router-outlet>
  `,
  styles: []
})
export class App1Component {
  topbarModel: ITopBarModel = {
    logoutTitle: 'logout',
    routerLinks: [
      { link: 'poly', title: 'linkToPoly' },
      { link: 'dumy', title: 'linkToDumy' },
    ],
    menuItems: []
  };
}
