import { Component, Input } from '@angular/core';

@Component({
    selector: 'p-simple-grid',
    templateUrl: './simple-grid.component.html',
    styleUrls: ['./simple-grid.component.scss'],
})
export class SimpleGridComponent {
    @Input() groups;
}
