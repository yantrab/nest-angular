import { Component } from '@angular/core';
import { Fund, UserSettings } from 'shared';
import { App1Controller } from 'src/api/app1.controller';

@Component({
  selector: 'p-poly',
  templateUrl: 'poly.component.html',
  styleUrls: ['poly.component.scss'],
})
export class PolyComponent {
  userSetting: UserSettings;
  funds: Fund[];
  constructor(private api: App1Controller) {
    this.api.getInitialData().then(initialData => {
      this.funds = initialData.funds;
      this.userSetting = initialData.userSetting;
    });
  }
}
