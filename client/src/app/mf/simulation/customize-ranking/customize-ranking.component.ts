import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Filter, SimulationSettings, SimulationRankType } from 'shared/models';
import { State } from '../models';

@Component({
    selector: 'p-customize-ranking',
    templateUrl: './customize-ranking.component.html',
    styleUrls: ['./customize-ranking.component.scss'],
})
export class CustomizeRankingComponent {
    @Input() state: State = State.editRanks;
    @Output() next = new EventEmitter(undefined);

    SimulationRankType = SimulationRankType;
    @Input() model: { simlulationSettings: SimulationSettings; gridGroups; totalExclude: number; typeRankFilter: Filter };
}
