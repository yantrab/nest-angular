import { Component, ViewEncapsulation } from '@angular/core';
import { TadorController } from 'src/api/tador.controller';
import { I18nService } from 'src/app/shared/services/i18n.service';
import { ITopBarModel } from '../../shared/components/topbar/topbar.interface';
import { saveAs } from 'file-saver';
import * as Panels from 'shared/models/tador/panels';
import { ContactField, FieldType, Panel } from 'shared/models/tador/panels';
import { AutocompleteFilter } from 'shared/models/filter.model';
import { cloneDeep } from 'lodash';
import { ActionType } from 'shared/models/tador/enum';
import { FormModel, FormComponent } from 'ng-dyna-form';
import { AddPanelRequest } from 'shared/models/tador/add-panel-request';
import { NgDialogAnimationService } from 'ng-dialog-animation';

// import * as conf from 'shared/models/tador/conf';
// Object.keys(conf).forEach(k => console.log(k + ':' + conf[k]));
@Component({
    selector: 'p-intercom-conf',
    templateUrl: './intercom-conf.component.html',
    styleUrls: ['./intercom-conf.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class IntercomConfComponent {
    formModel: FormModel<AddPanelRequest> = {
        feilds: [
            { placeHolder: 'iemi', key: 'iemi', appearance: 'outline' },
            { placeHolder: 'id', key: 'id', appearance: 'outline' },
        ],
        modelConstructor: AddPanelRequest,
        model: undefined,
        // errorTranslations: {
        //     'must be an email': 'נא הכנס מייל תקין',
        //     'must be a string': 'שדה חובה',
        // },
        formTitle: 'עריכה',
    };

    FieldType = FieldType;

    topbarModel: ITopBarModel = {
        logoutTitle: 'logout',
        routerLinks: [],
        menuItems: [],
    };
    constructor(private api: TadorController, public i18nService: I18nService, public dialog: NgDialogAnimationService) {
        this.api.initialData().then(data => {
            this.panels = data.map(d => new Panels[d.panel.type + 'Panel'](d.panel, d.dump));
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

    openAddPanel() {
        const dialogRef = this.dialog.open(FormComponent, {
            width: '80%',
            maxWidth: '540px',
            data: this.formModel,
        });
        dialogRef.afterClosed().subscribe(result => {
            this.api.savePanel(new Panel({ panelId: result })).then(panel => this.panels.push(panel));
        });
    }
}
