import { Component, OnInit } from '@angular/core';
import { MfService } from '../mf.service';
import { I18nService } from '../../shared/services/i18n.service';
import { Filter, SimulationSettings } from 'shared/models';

@Component({
    selector: 'p-simulation',
    templateUrl: './simulation.component.html',
    styleUrls: ['./simulation.component.scss'],
})
export class SimulationComponent implements OnInit {
    model: { simlulationSettings: SimulationSettings; gridGroups; totalExclude: number; typeRankFilter: Filter };
    constructor(private mfService: MfService, public i18nService: I18nService) {
        // this.i18nService.dic.subscribe(result => (this.dic = (result as any).findfund));
        this.mfService.simulationFund.subscribe(funds => {
            this.model = {
                simlulationSettings: funds.settings,
                gridGroups: funds.groups,
                totalExclude: funds.totalExclude,
                typeRankFilter: funds.typeRankFilter,
            };
        });
    }

    ngOnInit() {}
}
