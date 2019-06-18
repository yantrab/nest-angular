import { Component, Input } from '@angular/core';

@Component({
    selector: 'p-fund-card',
    templateUrl: './fund-card.component.html',
    styleUrls: ['./fund-card.component.scss'],
})
export class FundCardComponent {
    @Input() group;
}
