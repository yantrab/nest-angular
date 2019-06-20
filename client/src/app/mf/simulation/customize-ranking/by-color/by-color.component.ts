import { Component, Input } from '@angular/core';
import { State } from '../../models';
import { CustomizeParameterGroup } from 'shared/models';
import { cloneDeep } from 'lodash';

@Component({
    selector: 'p-by-color',
    templateUrl: './by-color.component.html',
    styleUrls: ['./by-color.component.scss'],
})
export class ByColorComponent {
    @Input() groups;
    @Input() parameterGroups: CustomizeParameterGroup[];
    colorGroups: Array<{ color: string; parameterGroups: CustomizeParameterGroup[] }>;
    selectedColorGroup: { color: string; parameterGroups: CustomizeParameterGroup[] };
    @Input() state: State = State.editRanks;
    State = State;

    back() {
        this.state = State.selectType;
    }
    ngOnInit() {
        this.parameterGroups.forEach(g => {
            g.percent = 100 / this.parameterGroups.length;
            g.parameters.forEach(p => (p.percent = 100 / g.parameters.length));
        });

        this.colorGroups = ['#ff6b81', '#ff9800', '#5352ed', '#448aff'].map(color => ({
            color,
            parameterGroups: cloneDeep(this.parameterGroups),
        }));
        this.selectedColorGroup = this.colorGroups[0];
    }
}
