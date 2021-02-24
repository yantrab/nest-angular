import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { saveAs } from 'file-saver';
import * as Panels from 'shared/models/tador/panels';
import { ContactField, ContactNameDirection, FieldType, Panel } from 'shared/models/tador/panels';
import { AutocompleteFilter } from 'shared/models/filter.model';
import { cloneDeep, keyBy } from 'lodash';
import { ActionType, PanelType } from 'shared/models/tador/enum';
import { FormComponent, FormModel } from 'ng-dyna-form';
import { AddPanelRequest } from 'shared/models/tador/add-panel-request';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import * as Socket from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Source } from 'shared/models/tador/panels';
import { User } from 'shared';
import { LogsComponent } from './logs/logs.component';
import { ConfService } from '../conf.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import * as conf from 'shared/models/tador/conf';
Object.keys(conf).forEach(k => console.log(k + ':' + conf[k]));
@Component({
    selector: 'p-intercom-conf',
    templateUrl: './intercom-conf.component.html',
    styleUrls: ['./intercom-conf.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class IntercomConfComponent implements OnInit {
    get isConnected(){
        return this.lastConnect < 7
    }
    lastConnect?: number;
    constructor(
        public api: ConfService,
        public dialog: NgDialogAnimationService,
        private snackBar: MatSnackBar,
        private ref: ChangeDetectorRef,
        private route: ActivatedRoute
    ) {
        this.socket.on('connect', () => console.log('socket connect!!!'));
        this.socket.on('status', status => {
            this.selectedPanel.actionType = status as ActionType;
            this.openSnack(ActionType[this.selectedPanel.actionType]);
        });
        this.socket.on('disconnect', () => console.log('disconnect socket!!!!'));
        this.socket.on('error', console.log);
        this.socket.on('log', msg => {
            console.log(msg);
            this.logs = [{ ...msg, time: Date.now()}, ...this.logs];
        });
        this.socket.on('pingg', msg => {
            if (!this.lastConnect){
                this.lastConnect = 0;
                setInterval(() => this.lastConnect++,1000)
            }else{
                this.lastConnect = 0;
            }
        });

        this.socket.on('sent', (location: any) => {
            console.log(location);
            if (!location) { return; }
            if (this.selectedPanel.contacts.changesList[location.index]) {
                delete this.selectedPanel.contacts.changesList[location.index][location.field];
            }
            this.selectedPanel.contacts = cloneDeep(this.selectedPanel.contacts);
            this.ref.markForCheck();
        });
        this.socket.on('sent-progress', (location: any) => {
            console.log(location);
            this.selectedPanel.contacts.changesList[location.index][location.field] = Source.PanelProgress;
            this.selectedPanel.contacts = cloneDeep(this.selectedPanel.contacts);
            this.ref.markForCheck();
        });

        this.socket.on('write', () => {
            this.setSelectedPanel(this.selectedPanel, true);
        });
    }
    get sendChangesLabel() {
        let count = 0;
        if (this.selectedPanel && this.selectedPanel.contacts.changesList) {
            this.selectedPanel.contacts.changesList
                .filter(c => c)
                .forEach(c => {
                    count += Object.values(c).filter(cc => cc).length;
                });
        }
        count += this.settingsChange;
        return 'שלח שינויים' + (count ? ' ( ' + count + ' )' : '');
    }
    complete$ = new Subject<any>();
    @ViewChild('myFileInput') myFileInput;
    socket = Socket(environment.socketUrl);
    private logs: any[] = [];

    FieldType = FieldType;
    panels: Panel[];
    users: {[id: string]: User};
    autocompleteSettings: AutocompleteFilter;

    selectedPanel: Panel;
    cloneSelectedPanel: Panel;
    contacts: ContactField[];
    inProgress = true;
    settingsChange = 0;
    ActionType = ActionType;

    ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.complete$)).subscribe(async params => {
            const id = params.id;
            const panel = await this.api.getPanel(id);
            this.setSelectedPanel(panel);
        });

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
        if (this.selectedPanel) {
          this.setSelectedPanel(this.selectedPanel, this.selectedPanel.actionType !== ActionType.idle);
        }
    }
    async setSelectedPanel(panel: Panel, reloadFromServer = false) {
        if (!panel) {return; }
        this.inProgress = true;
        this.snackBar.dismiss();
        if (this.selectedPanel) {
            this.socket.emit('unregister', this.selectedPanel.panelId);
        }

        this.socket.emit('register', panel.panelId);
        this.selectedPanel = panel;
        this.cloneSelectedPanel = cloneDeep(this.selectedPanel);
        if (reloadFromServer) {
            this.selectedPanel = await this.api.getPanel(panel.panelId);
        }

        if (this.selectedPanel.actionType !== undefined && this.selectedPanel.actionType !== ActionType.idle) {
            this.openSnackStatus(this.selectedPanel.actionType);
        }
        this.inProgress = false;
        // this.logs = [];
    }
    dump() {
        const blob = new Blob([this.selectedPanel.dump()], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'dump.txt');
    }

    handleFileInput(files: FileList) {
        const file =  files.item(0);
        const reader = new FileReader();
        reader.onload = e => {
            this.selectedPanel.reDump(reader.result.toString());
            this.ref.detectChanges();
            this.myFileInput.nativeElement.value = '';
        };
        reader.readAsText(file);
    }

    save() {
        this.openSnack('שומר');
        this.api.savePanel(this.selectedPanel).then(result => {
            this.selectedPanel = new Panels[result.panel.type + 'Panel'](result.panel, result.dump);
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
            // if ([ActionType.read, ActionType.readAll, ActionType.write, ActionType.writeAll].find(a => a === prevStatus)) {
            this.openSnack('שליחה מבוטלת');
            // }
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
        this.selectedPanel.contacts = cloneDeep(this.selectedPanel.contacts);
        this.api.savePanel(this.selectedPanel).then(panel => {
            this.openSnack('בוצע');
        });
    }

    async reset() {
        this.openSnack('מביא קובץ איתחול', '', { panelClass: 'snack', horizontalPosition: 'right' });
        const data = await this.api.getDefaultFile(this.selectedPanel.type, this.selectedPanel.contacts.nameDirection);
        const panel = this.selectedPanel;
        this.selectedPanel = undefined;
        panel.reDump(data.dump);
        this.ref.detectChanges();
        this.selectedPanel = panel;
        this.ref.detectChanges();
        this.openSnack('בוצע');
    }

    openLog() {
        this.dialog.open(LogsComponent, {
            height: '1000px',
            data: this.logs,
            animation: {to: 'top'},
            width: '80%',
            maxWidth: '1000px',
        });
    }

    ngOnDestroy() {
        this.complete$.next();            // <-- close open subscriptions
    }
}
