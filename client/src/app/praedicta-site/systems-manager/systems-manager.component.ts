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
    dir;
    @Input() isContuct: boolean;
    isHover: boolean = false;
    currentSystem: 'bonds' | 'holdings' | 'otherSolution' | 'contactUs' | 'aboutUs';
    settings = {
        main: { col: '1/7', row: '1/3', background: 'background-image: linear-gradient(to top, #67375b, #884977)'},
        bonds: Object.assign({
            content: {
                col: '5/14',
                row: '5',
            },
            color_en_he: '#54678c',
            topHe: '12%',
            topEng: '18%',
            widthHe: '86%',
            widthEng: '85%',
            fxLayoutAlignText: 'center',
            fxLayoutAlignImage: 'start end',
            backgroundText: ' 5 / 8 / 12 / 20',
            image: '63',
            logo: '#ffffe0',
            hoverbackground: 'rgba(44, 131, 133, 0.1)',
            background: 'linear-gradient(to bottom, #2c8385, #006a6c)',
            holdingsLocation: '2/5/auto/auto',
            otherSolutionLocation: '1/6/auto/auto',
            contactUsLocation: '2/6/auto/auto',
            aboutUsLocation: '1/1/auto/auto',
            imageLocation: '2/1/auto/4',
            imagegdGridAlign: 'end end ',
            contentLocation: '1/2/3/5',
            colorCircle: '#2C8385',
            cyCircle: '280',
            cxCircleEng: '280',
            cxCircleHe: '280',
        }),
        holdings: {
            content: {
                col: '12/14',
                row: '6',
            },
            color_en_he: '#54678c',
            topHe: '12%',
            topEng: '18%',
            widthHe: '84.5%',
            widthEng: '74%',
            fxLayoutAlignText: 'flex-end',
            fxLayoutAlignImage: 'center center',
            backgroundText: '7 / 6 / 14 / 8',
            image: '30',
            logo: '#f5e1db',
            hoverbackground: 'rgba(136, 73, 119, 0.1)',
            background: 'linear-gradient(to top, #67375b, #884977)',
            bondsLocation: '1/2/auto/auto',
            otherSolutionLocation: '1/6/auto/auto',
            contactUsLocation: '2/6/auto/auto',
            aboutUsLocation: '1/1/auto/auto',
            imageLocation: '2/2/auto/5',
            imagegdGridAlign: 'end end ',
            contentLocation: '1/3/3/6',
            colorCircle: '#884977',
            cyCircle: '180',
            cxCircleEng: '40',
             cxCircleHe: '280',
        },
        otherSolution: {
            content: {
                col: '10/14',
                row: '6',
            },
            color_en_he: '#b6cfe7',
            fxLayoutAlignText: 'flex-end',
            fxLayoutAlignImage: 'center end',
            topHe: '12%',
            topEng: '15%',
            widthHe: '71%',
            widthEng: '70%',
            image: '84',
            logo: ' #b6cfe7',
            hoverbackground: 'rgba(189, 86, 86, 0.1)',
            background: ' linear-gradient(to bottom, #bd5656, #83435f)',
            bondsLocation: '1/2/auto/auto',
            holdingsLocation: '2/1/auto/auto',
            contactUsLocation: '2/6/auto/auto',
            aboutUsLocation: '1/1/auto/auto',
            contentLocation: '1/3/3/6',
            imageLocation: '2/1/auto/6',
            imagegdGridAlign: 'center start',
            colorCircle: '#bd5656',
            cyCircle: '400',
            cxCircleEng: '280',
             cxCircleHe: '40',
        },
        contactUs: {
            content: {
                col: '16/16',
                row: '7',
            },
            color_en_he: '#feffdf',
            topHe: '18%',
            topEng: '24%',
            widthHe: '88%',
            widthEng: '89%',
            fxLayoutAlignText: 'flex-end',
            fxLayoutAlignImage: 'center end',
            image: '89',
            logo: 'url(#linear-gradient)',
            hoverbackground: 'rgba(107, 118, 255, 0.1)',
            background: ' linear-gradient(to bottom, #6b76ff, #465bdf)',
            bondsLocation: '1/2/auto/auto',
            holdingsLocation: '2/1/auto/auto',
            otherSolutionLocation: '1/3/auto/auto',
            aboutUsLocation: '1/1/auto/auto',
            imageLocation: '2/2/auto/6',
            imagegdGridAlign: 'start center',
            contentLocation: '1/4/3/6',
            colorCircle: '#6b76ff',
            cyCircle: '180',
            cxCircleEng: '280',
             cxCircleHe: '40',

        },
        aboutUs: {
            hoverbackground: 'rgba(107, 118, 255, 0.1)',
            colorCircle: '#6b76ff',
            cyCircle: '40',
            cxCircleEng: '40',
             cxCircleHe:'280',
        },
    };
    systemsList;
    constructor(public i18nService: I18nService, private router: Router) {
        this.i18nService.dic.subscribe(result => {
            this.dic = result as any;
            this.dir = this.i18nService.dir;
        });
        this.currentSystem = window.location.pathname.split('/').reverse()[0] as any;
        const general = { Contact_usCol: '6', Contact_usRow: '2', About_UsCol: '1/2', About_UsRow: '1' };
        this.systemsList = [
            { name: 'bonds' },
            { name: 'holdings' },
            { name: 'otherSolution' },
            { name: 'contactUs' },
            { name: 'aboutUs' },
        ];
    }

    ngOnInit() {}
    navigate(to: string) {
        this.router.navigate([window.location.pathname.split('/')[1] + '/' + to, {}]).then();
        this.currentSystem = to as any;
    }
    changeDirection() {
        this.i18nService.language = this.i18nService.language === 'he' ? 'en' : 'he';
    }
}
