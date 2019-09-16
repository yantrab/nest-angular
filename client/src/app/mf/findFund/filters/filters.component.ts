import { Component, EventEmitter, Input, Output, OnInit, ViewChildren, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { FilterGroup } from 'shared/models';
import { MatExpansionPanel } from '@angular/material';
@Component({
    selector: 'p-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent implements OnInit {
    @Output() selectedChange = new EventEmitter();
    @Input() groups: FilterGroup[];
    @Input() dic;
    @Input() dataSource;
    @ViewChildren(MatExpansionPanel, { read: ElementRef }) panels;
    ngOnInit(): void {
        // this.groups.forEach(group =>{
        //     group.filter
        // })
    }
    groupNameClick(e) {
        e.stopPropagation();
    }
    opened(i) {
        if (i > 0) setTimeout(() => this.panels.toArray()[i].nativeElement.scrollIntoView({ behavior: 'smooth' }));
    }
}
