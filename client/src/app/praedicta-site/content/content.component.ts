import { Component, Input, OnInit } from '@angular/core';
import { I18nService } from '../../shared/services/i18n.service';

@Component({
    selector: 'p-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
})
export class ContentComponent implements OnInit {
    @Input() model: { title: string; content: string };
    @Input() currentSystem: string;
    // @Input() direction: string = 'rtl';
    settings;
    constructor(public i18nService: I18nService) {
        this.settings = {
            holdings: { padding: '0 0 0 9em' },
            bonds: { padding: '0 0 0 3em' },
            otherSolution: { padding: '0 0 0 3em' },
        };
    }

    ngOnInit() {
        // console.log('x');
    }
}
