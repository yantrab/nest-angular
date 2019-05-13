import {Component, ViewEncapsulation} from '@angular/core';
import {TadorController} from 'src/api/tador.controller';
import {I18nService} from 'src/app/shared/services/i18n.service';
import {ITopBarModel} from '../../shared/components/topbar/topbar.interface';

import {Panel} from 'shared/models/tador.model';
import {AutocompleteFilter} from "shared/models";

@Component({
    selector: 'p-intercom-conf',
    templateUrl: './intercom-conf.component.html',
    styleUrls: ['./intercom-conf.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class IntercomConfComponent {
    topbarModel: ITopBarModel = {
        logoutTitle: 'logout',
        routerLinks: [],
        menuItems: [],
    };

    constructor(private api: TadorController, public i18nService: I18nService) {
        this.panels = Array(10)
            .fill(0)
            .map(
                (_, i) =>
                    new Panel({
                        _id: i.toString(),
                        address: '1600 Amphitheatre Pkwy',
                        name: 'asd',
                        type: 'MP',
                        version: 1.1
                    }),
            );
        this.autocompleteSettings = new AutocompleteFilter({options: this.panels});
        this.selectedPanel = this.panels[0];
    }

    panels: Panel[];
    autocompleteSettings: AutocompleteFilter;
    selectedPanel: Panel;
}
