import { Component, ViewEncapsulation } from '@angular/core';
import { TadorController } from 'src/api/tador.controller';
import { I18nService } from 'src/app/shared/services/i18n.service';
import { ITopBarModel } from '../../shared/components/topbar/topbar.interface';
import { saveAs } from 'file-saver';
import * as Panels from 'shared/models/tador/panels';
import { ContactField, FieldType, Panel } from 'shared/models/tador/panels';
import { AutocompleteFilter } from 'shared/models/filter.model';
import { cloneDeep } from 'lodash';
import { ActionType, PanelType } from 'shared/models/tador/enum';
import { FormComponent, FormModel } from 'ng-dyna-form';
import { AddPanelRequest } from 'shared/models/tador/add-panel-request';
import { DialogService } from '../../shared/services/dialog.service';

import * as conf from 'shared/models/tador/conf';
Object.keys(conf).forEach(k => console.log(k + ':' + conf[k]));
@Component({
    selector: 'p-intercom-conf',
    templateUrl: './intercom-conf.component.html',
    styleUrls: ['./intercom-conf.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class IntercomConfComponent {
    constructor(private api: TadorController, public i18nService: I18nService, public dialog: DialogService) {
        this.api.initialData().then(data => {
            this.panels = data.map(d => new Panels[d.panel.type + 'Panel'](d.panel, d.dump));
            this.autocompleteSettings = new AutocompleteFilter({ options: this.panels });
            this.setSelectedPanel(this.panels[0]);
        });
    }
    formModel: FormModel<AddPanelRequest> = {
        feilds: [{ placeHolder: 'iemi', key: 'iemi' }, { placeHolder: 'id', key: 'id' }],
        modelConstructor: AddPanelRequest,
        formTitle: 'הוספת פאנל',
        model: new AddPanelRequest(),
    };

    FieldType = FieldType;

    topbarModel: ITopBarModel = {
        logoutTitle: 'logout',
        routerLinks: [],
        menuItems: [],
    };
    panels: Panel[];
    autocompleteSettings: AutocompleteFilter;

    selectedPanel: Panel;
    cloneSelectedPanel: Panel;
    contacts: ContactField[];
    setSelectedPanel(panel: Panel) {
        this.selectedPanel = panel;
        this.cloneSelectedPanel = cloneDeep(this.selectedPanel);
    }
    dump() {
        const blob = new Blob([this.selectedPanel.dump()], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'dump.txt');
    }

    handleFileInput(target: any) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = e => {
            this.selectedPanel.reDump(reader.result.toString());
        };
        reader.readAsText(file);
    }

    save() {
        // a
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

    openAddPanel() {
        const dialogRef = this.dialog.open(FormComponent, {
            width: '80%',
            maxWidth: '540px',
            data: this.formModel,
        });
        dialogRef.afterClosed().subscribe((result: AddPanelRequest) => {
            if (!result) {
                return;
            }
            result = Object.assign(new AddPanelRequest(), result);
            if (!result.isMatch) {
                this.formModel.model = result;
                return this.openAddPanel();
            }

            this.formModel.model = new AddPanelRequest();
            this.api.addNewPanel({ type: PanelType.MP, panelId: result.iemi }).then(panel => {
                this.panels.push(new Panels[panel.type + 'Panel'](panel));
                this.autocompleteSettings.options = [...this.panels];
                this.setSelectedPanel(panel);
                // this.autocompleteSettings.selected.selectedPanel = this.panels[this.panels.length - 1];
            });
        });
    }
}
