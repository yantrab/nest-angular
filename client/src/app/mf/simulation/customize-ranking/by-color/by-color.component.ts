import { Component, EventEmitter, Input, Output } from '@angular/core';
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
    @Output() next = new EventEmitter(undefined);
    @Input() parameterGroups: CustomizeParameterGroup[];
    colorGroups: Array<{ color: string; parameterGroups: CustomizeParameterGroup[] }>;
    selectedColorGroup: { color: string; parameterGroups: CustomizeParameterGroup[] };
    @Input() state: State = State.editRanks;
    State = State;

    back() {
        this.state = State.editRanks;
    }
    ngOnInit() {
        this.colorGroups = ['#ff6b81', '#ff9800', '#5352ed', '#448aff'].map(color => ({
            color,
            parameterGroups: cloneDeep(this.parameterGroups),
        }));
        this.selectedColorGroup = this.colorGroups[0];
    }
}
