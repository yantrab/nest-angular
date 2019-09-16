import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'p-select-rank-type',
    templateUrl: './select-rank-type.component.html',
    styleUrls: ['./select-rank-type.component.scss'],
})
export class SelectRankTypeComponent {
    @Input() groups;
    @Input() typeRankFilter;
    @Output() next = new EventEmitter();
}
