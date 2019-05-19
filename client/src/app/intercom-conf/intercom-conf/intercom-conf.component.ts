import {Component, ViewEncapsulation} from '@angular/core';
import {TadorController} from 'src/api/tador.controller';
import {I18nService} from 'src/app/shared/services/i18n.service';
import {ITopBarModel} from '../../shared/components/topbar/topbar.interface';

import {Contact, Panel} from 'shared/models/tador.model';
import {AutocompleteFilter} from "shared/models";
import {ColumnDef} from "mat-virtual-table";

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
                        address: '1600 Amphitheatre Pkwy',
                        name: 'פאנל ' + i,
                        type: 'MP',
                        version: 1.1,
                        contacts: new Array(250).fill(1)
                            .map((_, index) => new Contact(
                                {
                                    startIndex: index * 50,
                                    _id: index + 1,
                                    feilds: [
                                        {property: 'name1', title: 'שם 1', length: 10},
                                        {property: 'name2', title: 'שם 2', length: 10},
                                        {property: 'phone1', title: 'טלפון 1', length: 10},
                                        {property: 'phone2', title: 'טלפון 2', length: 10}

                                    ]
                                })),
                        settings: {},
                        userId: '',
                    }),
            );
        this.autocompleteSettings = new AutocompleteFilter({options: this.panels});
        this.selectedPanel = this.panels[0];
        this.contactColumn.push(...this.selectedPanel.contacts[0].feilds.map(f =>
            ({field: f.property, title: f.title})));

    }

    panels: Panel[];
    autocompleteSettings: AutocompleteFilter;
    selectedPanel: Panel;
    contactColumn: ColumnDef[] = [
        {field: '_id', title: ' ', width: '70px', isSortable: false},
    ];
}
