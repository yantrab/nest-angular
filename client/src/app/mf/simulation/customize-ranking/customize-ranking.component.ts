import { Component, Input } from '@angular/core';
import { Filter, SimulationSettings, SimulationRankType } from 'shared/models';
enum State {
    selectType,
    editRanks,
}
@Component({
    selector: 'p-customize-ranking',
    templateUrl: './customize-ranking.component.html',
    styleUrls: ['./customize-ranking.component.scss'],
})
export class CustomizeRankingComponent {
    state: State = State.selectType;
    State = State;
    SimulationRankType = SimulationRankType;
    rankType: SimulationRankType;
    @Input() model: { simlulationSettings: SimulationSettings; gridGroups; totalExclude: number; typeRankFilter: Filter };
}
