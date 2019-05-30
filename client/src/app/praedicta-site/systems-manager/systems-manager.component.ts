import { Component, Input, OnInit } from '@angular/core';
import { I18nRootObject } from '../../../api/i18n/site.i18n';
import { I18nService } from '../../shared/services/i18n.service';
import { Router } from '@angular/router';

@Component({
    selector: 'p-systems-manager',
    templateUrl: './systems-manager.component.html',
    styleUrls: ['./systems-manager.component.scss'],
})
export class SystemsManagerComponent implements OnInit {
    dic: I18nRootObject;
    isHover: boolean = false;
    currentSystem: 'bonds' | 'holdings' | 'otherSolution' | 'contactUs' | 'aboutUs';
    settings = {
        main: { col: '1/7', row: '1/3', background: 'background-image: linear-gradient(to top, #67375b, #884977)' },
        bonds: Object.assign({
            content: {
                col: '5/14',
                row: '5',
            },
            image: '21 / 1 / 21 / 6',
            logo: '#ffffe0',
            hoverbackground: '#f8eeeb',
            background: 'linear-gradient(to bottom, #2c8385, #006a6c)',
            holdingsCol: '5',
            holdingsRow: '2',
            otherSolutionCol: '6',
            otherSolutionRow: '1',
            Contact_usCol: '6',
            Contact_usRow: '2',
            About_UsCol: '1/2',
            About_UsRow: '1',
        }),
        holdings: {
            content: {
                col: '12/14',
                row: '6',
            },
            image: '21 / 5 / 21 / 14',
            logo: '#f5e1db',
            background: 'linear-gradient(to top, #67375b, #884977)',
            bondsCol: '2',
            bondsRow: '1',
            otherSolutionCol: '6',
            otherSolutionRow: '1',
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
            logo: ' #b6cfe7',
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
        contactUs: {
            content: {
                col: '16/16',
                row: '7',
            },
            image: '11 / 5 / 20 / 20',
            logo: 'url(#linear-gradient)',
            background: ' linear-gradient(to bottom, #6b76ff, #465bdf)',
            bondsCol: '2',
            bondsRow: '1',
            holdingsCol: '1',
            holdingsRow: '2',
            otherSolutionCol: '3',
            otherSolutionRow: '1',
            About_UsCol: '1/2',
            About_UsRow: '1',
        },
    };

    // currentSystem = window.location.pathname
    //     .split('/')
    //     .reverse()[0]
    //     .toLowerCase();
    constructor(public i18nService: I18nService, private router: Router) {
        this.i18nService.dic.subscribe(result => {
            this.dic = result as any;
        });
        this.currentSystem = window.location.pathname.split('/').reverse()[0] as any;
        const general = { Contact_usCol: '6', Contact_usRow: '2', About_UsCol: '1/2', About_UsRow: '1' };
    }

    ngOnInit() {}
    navigate(to: string) {
        this.router.navigate([window.location.pathname.split('/')[1] + '/' + to, {}]).then();
        this.currentSystem = to as any;
    }
    changeDirection() {
        this.i18nService.language = this.i18nService.language == 'he' ? 'en' : 'he';
    }
}
