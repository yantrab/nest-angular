import {Component, Input, OnInit} from '@angular/core';
import { I18nService } from 'src/app/shared/services/i18n.service';
import { I18nRootObject } from 'src/api/i18n/site.i18n';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { DynaFormBuilder } from 'ng-dyna-form';
import { LeadRequest } from 'shared/models/site.model';

@Component({
    selector: 'p-praedicta-site',
    templateUrl: './praedicta-site.component.html',
    styleUrls: ['./praedicta-site.component.scss'],
})
export class PraedictaSiteComponent implements OnInit {
    direction = 'rtl';
    dir;

    form: FormGroup;
    dic: I18nRootObject;
    isHide: boolean = true;
    isContuct: boolean = false;
    hover: boolean = false;
    constructor(public i18nService: I18nService, private router: Router, private dynaFB: DynaFormBuilder) {
        this.i18nService.dic.subscribe(result => {
            this.dic = result as any;
            this.dir = this.i18nService.dir;
        });
        this.dynaFB.buildFormFromClass(LeadRequest).then(form => (this.form = form));
    }
    ngOnInit() {}
    navigate(to: string) {
        this.router.navigate([window.location.pathname + '/' + to, {}]).then();
    }

    changeDirection(event) {
        event.stopPropagation();
        this.i18nService.language = this.i18nService.language == 'he' ? 'en' : 'he';
    }
}
