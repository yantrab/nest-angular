import { Component, Input, OnInit } from '@angular/core';
import { ITopBarModel } from './topbar.interface';
import { I18nService } from '../../services/i18n.service';

@Component({
    selector: 'p-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
    @Input() model: ITopBarModel;
    @Input() inProgress;
    ngOnInit(): void {
        this.model.logo = 'assets/img/mf/logoMf.png';
        // this.model.menuItems.push({ action: () => (this.i18nService.language = 'en'), title: 'en' });
        // this.model.menuItems.push({ action: () => (this.i18nService.language = 'he'), title: 'he' });
    }
    constructor(public i18nService: I18nService) {}
}
