import { Component, ViewEncapsulation } from '@angular/core';
import { TadorController } from 'src/api/tador.controller';
import { I18nService } from 'src/app/shared/services/i18n.service';
import { ITopBarModel } from '../../shared/components/topbar/topbar.interface';
import { saveAs } from 'file-saver';
import { ContactField, FieldType, Panel } from 'shared/models/tador/panels';
import { AutocompleteFilter } from 'shared/models/filter.model';
import * as Panels from 'shared/models/tador/panels';
import { merge } from 'lodash';
import * as conf from 'shared/models/tador/conf';
Object.keys(conf).forEach(k => console.log(k + ':' + conf[k]));
@Component({
    selector: 'p-intercom-conf',
    templateUrl: './intercom-conf.component.html',
    styleUrls: ['./intercom-conf.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class IntercomConfComponent {
    FieldType = FieldType;

    topbarModel: ITopBarModel = {
        logoutTitle: 'logout',
        routerLinks: [],
        menuItems: [],
    };

    constructor(private api: TadorController, public i18nService: I18nService) {
        this.api.initialData().then(data => {
            this.panels = data.map(panel => merge(new Panels[panel.type + 'Panel'](), panel));
            this.autocompleteSettings = new AutocompleteFilter({ options: this.panels });
            this.selectedPanel = this.panels[0];
        });
    }

    dump() {
        const blob = new Blob([this.selectedPanel.dump()], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'dump.txt');
        // console.log(this.selectedPanel.dump());
    }
    panels: Panel[];
    autocompleteSettings: AutocompleteFilter;
    selectedPanel: Panel;
    contacts: ContactField[];

    handleFileInput(target: EventTarget) {
        const file = target['files'][0];
        const reader = new FileReader();
        reader.onload = e => {
            this.selectedPanel.reDump(reader.result.toString());
        };
        reader.readAsText(file);
    }
}
