import { EventEmitter, Injectable } from '@angular/core';
import { ContactNameDirection, Panel } from 'shared/models/tador/panels';
import { TadorController } from '../../api/tador.controller';
import * as Panels from 'shared/models/tador/panels';
import { PanelType } from 'shared/models/tador/enum';
import {Subject, BehaviorSubject, ReplaySubject} from "rxjs";
import { AddPanelRequest } from 'shared/models/tador/add-panel-request';
@Injectable({
    providedIn: 'root',
})
export class ConfService {
    constructor(private api: TadorController) {
        this.api.initialData().then(data => {
            this.data = {panels: data.panels.map(d => new Panels[d.panel.type + 'Panel'](d.panel, d.dump)), users: data.users};
            this.dataSub.next(this.data);
        });
    }
    data: { users: any; panels: any };
    dataSub: ReplaySubject<{ users: any; panels: any }> = new ReplaySubject();

    async getPanel(id: string): Promise<any> {
        const panel = await this.api.panels(id);
        const result = new Panels[panel.type + 'Panel'](panel);
        return result;
    }

    async savePanel(panel: Panel): Promise<{ panel: any; dump: any }> {
        return this.api.savePanel(panel);
    }

    async addNewPanel(body: AddPanelRequest): Promise<Panel> {
        const result = await this.api.addNewPanel(body);
        this.data.panels.push(new Panels[result.type + 'Panel'](result));
        this.dataSub.next(this.data);
        return result;
    }

    async status(panel: Panel): Promise<any> {
        return this.api.status(panel);
    }

    async removeChanges(panel: Panel): Promise<Panel> {
        return this.api.removeChanges(panel);
    }

    async getDefaultFile(type: string, direction: ContactNameDirection): Promise<any> {
        return this.api.getDefaultFile(type, direction);
    }

}
