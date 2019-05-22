import { Component, OnInit } from '@angular/core';
import { I18nRootObject } from '../../../api/i18n/site.i18n';
import { I18nService } from '../../shared/services/i18n.service';

@Component({
    selector: 'p-systems-manager',
    templateUrl: './systems-manager.component.html',
    styleUrls: ['./systems-manager.component.scss'],
})
export class SystemsManagerComponent implements OnInit {
    dic: I18nRootObject;
    settings;
    state: 'login' | 'signin';
    currentSystem = window.location.pathname
        .split('/')
        .reverse()[0]
        .toLowerCase();
    constructor(public i18nService: I18nService) {
        this.i18nService.dic.subscribe(result => {
            this.dic = result as any;
        });
        this.state = window.location.pathname.split('/')[1] as any;
        const general = { Contact_usCol: '6', Contact_usRow: '2', About_UsCol: '1/2', About_UsRow: '1' };
        this.settings = {
            main: { col: '1/7', row: '1/3', background: 'background-image: linear-gradient(to top, #67375b, #884977)' },
            bonds: Object.assign(
                {
                    content: {
                        col: '5/14',
                        row: '5',
                    },
                    padding: '0 3em',
                    background: 'linear-gradient(to bottom, #2c8385, #006a6c)',
                    holdingsCol: '5',
                    holdingsRow: '2',
                    Other_solutionCol: '6',
                    Other_solutionRow: '1',
                    Contact_usCol: '6',
                    Contact_usRow: '2',
                    About_UsCol: '1/2',
                    About_UsRow: '1',
                },
                general,
            ),
            holdings: {
                content: {
                    col: '12/14',
                    row: '6',
                },
                padding: '0 3em',
                background: 'linear-gradient(to top, #67375b, #884977)',
                bondsCol: '2',
                bondsRow: '1',
                Other_solutionCol: '6',
                Other_solutionRow: '1',
                Contact_usCol: '6',
                Contact_usRow: '2',
                About_UsCol: '1/2',
                About_UsRow: '1',
            },
            otherSolution: {
                content: {
                    col: '10/14',
                    row: '7',
                },
                background: ' linear-gradient(to bottom, #bd5656, #83435f)',
                bondsCol: '2',
                bondsRow: '1',
                holdingsCol: '1',
                holdingsRow: '2',
                Contact_usCol: '6',
                Contact_usRow: '2',
                About_UsCol: '1/2',
                About_UsRow: '1',
            },
            contact_us: {
                background: ' linear-gradient(to bottom, #6b76ff, #465bdf)',
                bondsCol: '2',
                bondsRow: '1',
                holdingsCol: '1',
                holdingsRow: '2',
                Other_solutionCol: '3',
                Other_solutionRow: '1',
                About_UsCol: '1/2',
                About_UsRow: '1',
            },
        };
    }

    ngOnInit() {}
    changeDirection() {
        this.i18nService.language = this.i18nService.language == 'he' ? 'en' : 'he';
    }
}
