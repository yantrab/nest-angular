import { Component, OnInit } from '@angular/core';
import { MfService } from '../mf.service';
import { I18nService } from '../../shared/services/i18n.service';
import { Filter, SimulationSettings } from 'shared/models';
import { State } from './models';
import { I18nFilters, I18nRootObject, I18nSimulation } from '../../../api/i18n/mf.i18n';

@Component({
    selector: 'p-simulation',
    templateUrl: './simulation.component.html',
    styleUrls: ['./simulation.component.scss'],
})
export class SimulationComponent implements OnInit {
    State = State;
    completed = [false, false, false, false, false];
    stepperIndex = 0;
    dicFilters: I18nFilters;
    dicSimulation: I18nSimulation;
    model: { simlulationSettings: SimulationSettings; gridGroups; totalExclude: number; typeRankFilter: Filter };
    constructor(private mfService: MfService, public i18nService: I18nService) {
        this.i18nService.dic.subscribe(result => {
            this.dicFilters = (result as I18nRootObject).findfund.filters;
            this.dicSimulation = (result as I18nRootObject).simulation;
        });
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

    next(current: number) {
        this.completed[current] = true;
        setTimeout(() => (this.stepperIndex = current + 1));
    }
}
