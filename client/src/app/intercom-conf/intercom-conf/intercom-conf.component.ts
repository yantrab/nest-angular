import { ChangeDetectorRef, Component, HostListener, ViewEncapsulation } from '@angular/core';
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
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import * as Socket from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Source } from 'shared/models/tador/panels';

// Object.keys(conf).forEach(k => console.log(k + ':' + conf[k]));
@Component({
    selector: 'p-intercom-conf',
    templateUrl: './intercom-conf.component.html',
    styleUrls: ['./intercom-conf.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class IntercomConfComponent {
    socket = Socket(environment.socketUrl);
    constructor(
        private api: TadorController,
        public i18nService: I18nService,
        public dialog: DialogService,
        private snackBar: MatSnackBar,
        private ref: ChangeDetectorRef,
    ) {
        this.api.initialData().then(data => {
            this.panels = data.map(d => new Panels[d.panel.type + 'Panel'](d.panel, d.dump));
            this.autocompleteSettings = new AutocompleteFilter({ options: this.panels });
            this.inProgress = false;
            this.setSelectedPanel(this.panels[0]);
        });

        this.socket.on('connect', () => console.log('socket connect!!!'));
        this.socket.on('status', status => {
            this.selectedPanel.actionType = status as ActionType;
            this.openSnack(ActionType[this.selectedPanel.actionType]);
        });
        this.socket.on('disconnect', () => console.log('disconnect socket!!!!'));
        this.socket.on('error', console.log);
        this.socket.on('log', msg => {
            console.log(msg);
        });

        this.socket.on('sent', (location: any) => {
            console.log(location);
            delete this.selectedPanel.contacts.changesList[location.index][location.field];
            this.selectedPanel.contacts = cloneDeep(this.selectedPanel.contacts);
            this.ref.markForCheck();
        });

        this.socket.on('write', (contacts: any) => {
            this.selectedPanel.contacts = contacts;
            this.ref.markForCheck();
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
    inProgress = true;
    get sendChangesLabel() {
        let count = 0;
        if (this.selectedPanel && this.selectedPanel.contacts.changesList) {
            this.selectedPanel.contacts.changesList
                .filter(c => c)
                .forEach(c => {
                    count += Object.values(c).filter(cc => cc).length;
                });
        }
        return 'שלח שינויים' + (count ? ' ( ' + count + ' )' : '');
    }
    openSnack(
        title: string,
        action = 'סגור',
        config: MatSnackBarConfig = { duration: 1000, panelClass: 'snack', horizontalPosition: 'right' },
    ) {
        return this.snackBar.open(title, action, config);
    }
    @HostListener('window:focus', ['$event'])
    onFocus(event: any): void {
        this.setSelectedPanel(this.selectedPanel, this.selectedPanel.actionType !== ActionType.idle);
    }
    async setSelectedPanel(panel: Panel, reloadFromServer = false) {
        this.inProgress = true;
        this.snackBar.dismiss();
        if (this.selectedPanel) {
            this.socket.emit('unregister', this.selectedPanel.panelId);
        }

        this.socket.emit('register', panel.panelId);
        this.selectedPanel = panel;
        this.cloneSelectedPanel = cloneDeep(this.selectedPanel);
        if (reloadFromServer) {
            this.selectedPanel = new Panels[panel.type + 'Panel'](await this.api.panels(panel.panelId));
        }

        if (this.selectedPanel.actionType !== undefined && this.selectedPanel.actionType !== ActionType.idle) {
            this.openSnackStatus(this.selectedPanel.actionType);
        }
        this.inProgress = false;
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
        this.openSnack('שומר');
        this.api.savePanel(this.selectedPanel).then(result => {
            this.selectedPanel = result;
            this.cloneSelectedPanel = cloneDeep(this.selectedPanel);
            this.openSnack('נשמר');
            this.ref.markForCheck();
            console.table(this.selectedPanel.contacts.changesList);
        });
    }

    cancel() {
        this.selectedPanel = cloneDeep(this.cloneSelectedPanel);
        this.openSnack('שינויים בוטלו');
    }
    async status(status: ActionType) {
        this.openSnackStatus(status);
        this.selectedPanel.actionType = status;
        await this.api.status(this.selectedPanel);
    }

    openSnackStatus(status: ActionType) {
        const snackBarRef = this.openSnack(ActionType[status], 'בטל', { panelClass: 'snack', horizontalPosition: 'right' });
        snackBarRef.onAction().subscribe(async () => {
            this.openSnack('מבטל שליחה', '', { panelClass: 'snack', horizontalPosition: 'right' });
            const prevStatus = this.selectedPanel.actionType;
            this.selectedPanel.actionType = ActionType.idle;
            await this.api.status(this.selectedPanel);
            //if ([ActionType.read, ActionType.readAll, ActionType.write, ActionType.writeAll].find(a => a === prevStatus)) {
            this.openSnack('שליחה מבוטלת');
            //}
        });
    }

    sentAll() {
        this.status(ActionType.readAll);
    }

    sentChanges() {
        this.status(ActionType.read);
    }

    getAll() {
        this.status(ActionType.writeAll);
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
                this.openSnack('פנל הוסף בהצלחה');
            });
        });
    }

    removeChanges() {
        this.openSnack('מוחק שינויים', '', { panelClass: 'snack', horizontalPosition: 'right' });
        this.api.removeChanges(this.selectedPanel).then(panel => {
            this.openSnack('בוצע');
            this.selectedPanel = panel;
        });
    }

    removeGreenChanges() {
        this.openSnack('מוחק סמונים ירוקים', '', { panelClass: 'snack', horizontalPosition: 'right' });
        for (const c of this.selectedPanel.contacts.changesList) {
            Object.keys(c).forEach(key => {
                if (c[key] === Source.Panel) {
                    delete c[key];
                }
            });
        }
        this.api.savePanel(this.selectedPanel).then(panel => {
            this.openSnack('בוצע');
            this.ref.markForCheck();
        });
    }
}
