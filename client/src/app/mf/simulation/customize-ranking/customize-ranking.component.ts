import { Component, Input } from '@angular/core';
import { Filter, SimulationSettings, SimulationRankType } from 'shared/models';
import { State } from '../models';

@Component({
    selector: 'p-customize-ranking',
    templateUrl: './customize-ranking.component.html',
    styleUrls: ['./customize-ranking.component.scss'],
})
export class CustomizeRankingComponent {
    @Input() state: State = State.selectType;
    State = State;
    SimulationRankType = SimulationRankType;
    @Input() model: { simlulationSettings: SimulationSettings; gridGroups; totalExclude: number; typeRankFilter: Filter };

    setEdit() {
        this.state = State.editRanks;
    }

    ngOnInit() {}
}
