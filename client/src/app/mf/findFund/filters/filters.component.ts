import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterGroup } from 'shared/models';

@Component({
    selector: 'p-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
    constructor() {}
    @Output() selectedChange = new EventEmitter();
    @Input() groups: FilterGroup[];
    ngOnInit() {}
}
