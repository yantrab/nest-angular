import { Component, ViewEncapsulation } from '@angular/core';
import { TadorController } from 'src/api/tador.controller';
import { I18nService } from 'src/app/shared/services/i18n.service';
import { ITopBarModel } from '../../shared/components/topbar/topbar.interface';
import { saveAs } from 'file-saver';
import * as Panels from 'shared/models/tador/panels';
import { ContactField, FieldType, Panel } from 'shared/models/tador/panels';
import { AutocompleteFilter } from 'shared/models/filter.model';
import { merge, cloneDeep, assign } from 'lodash';
import { ActionType } from 'shared/models/tador/enum';

// import * as conf from 'shared/models/tador/conf';
// Object.keys(conf).forEach(k => console.log(k + ':' + conf[k]));
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
            this.panels = data.map(panel => assign(new Panels[panel.type + 'Panel'](), panel));
            this.autocompleteSettings = new AutocompleteFilter({ options: this.panels });
            this.setSelectedPanel(this.panels[0]);
        });
    }
    setSelectedPanel(panel: Panel) {
        this.selectedPanel = panel;
        this.cloneSelectedPanel = cloneDeep(this.selectedPanel);
    }
    dump() {
        const blob = new Blob([this.selectedPanel.dump()], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'dump.txt');
    }
    panels: Panel[];
    autocompleteSettings: AutocompleteFilter;
    selectedPanel: Panel;
    cloneSelectedPanel: Panel;
    contacts: ContactField[];

    handleFileInput(target: EventTarget) {
        const file = target['files'][0];
        const reader = new FileReader();
        reader.onload = e => {
            this.selectedPanel.reDump(reader.result.toString());
        };
        reader.readAsText(file);
    }

    save() {
        this.api.savePanel(this.selectedPanel).then(result => {
            this.cloneSelectedPanel = cloneDeep(this.selectedPanel);
        });
    }

    cancel() {
        this.selectedPanel = cloneDeep(this.cloneSelectedPanel);
    }

    sentAll() {
        this.selectedPanel.actionType = ActionType.readAll;
        this.api.status(this.selectedPanel);
    }

    sentChanges() {
        this.selectedPanel.actionType = ActionType.read;
        this.api.status(this.selectedPanel);
    }

    getAll() {
        this.selectedPanel.actionType = ActionType.writeAll;
        this.api.status(this.selectedPanel);
    }
}
