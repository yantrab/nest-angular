import {Component, ViewEncapsulation} from '@angular/core';
import {TadorController} from 'src/api/tador.controller';
import {I18nService} from 'src/app/shared/services/i18n.service';
import {ITopBarModel} from '../../shared/components/topbar/topbar.interface';

import {ContactField, Contacts, Panel } from 'shared/models/tador.model';
import {AutocompleteFilter} from 'shared/models';

@Component({
    selector: 'p-intercom-conf',
    templateUrl: './intercom-conf.component.html',
    styleUrls: ['./intercom-conf.component.scss'],
    encapsulation: ViewEncapsulation.None,
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
                        address: '1600 Amphitheatre Pkwy',
                        name: 'פאנל ' + i,
                        type: 'MP',
                        version: 1.1,
                        contacts: new Contacts({
                            index: 5000,
                            count: 250,
                            contactFields: [
                                    new ContactField({property: 'name1', title: 'שם 1', length: 10}),
                                    new ContactField({property: 'phone1', title: 'טלפון 1', length: 10}),
                                    new ContactField({property: 'phone2', title: 'טלפון 2', length: 10}),
                                    new ContactField({property: 'phone3', title: 'טלפון 3', length: 10}),
                                    new ContactField({property: 'phone4', title: 'טלפון 4', length: 10}),
                                    new ContactField({property: 'phone5', title: 'טלפון 5', length: 10}),
                                    new ContactField({property: 'phone6', title: 'טלפון 6', length: 10}),
                                    new ContactField({property: 'code', title: 'קוד', length: 10}),
                                    new ContactField({property: 'reff', title: 'reff', length: 10}),
                                    new ContactField({property: 'apartment', title: 'apartment', length: 10}),
                                ],
                        }),
                        settings: {},
                        userId: '',
                    }),
            );
        this.autocompleteSettings = new AutocompleteFilter({options: this.panels});
        this.selectedPanel = this.panels[0];
    }

    panels: Panel[];
    autocompleteSettings: AutocompleteFilter;
    selectedPanel: Panel;
    contacts: ContactField[];
}
