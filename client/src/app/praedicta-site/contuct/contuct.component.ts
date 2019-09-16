import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { I18nRootObject } from '../../../api/i18n/site.i18n';
import { I18nService } from '../../shared/services/i18n.service';
import { Router } from '@angular/router';
import { DynaFormBuilder } from 'ng-dyna-form';
import { LeadRequest } from 'shared/models/site.model';

@Component({
    selector: 'p-contuct',
    templateUrl: './contuct.component.html',
    styleUrls: ['./contuct.component.scss'],
})
export class ContuctComponent implements OnInit {
    form: FormGroup;
    dic: I18nRootObject;

    @Output()   onClose = new EventEmitter();
    constructor(public i18nService: I18nService, private router: Router, private dynaFB: DynaFormBuilder) {
        this.i18nService.dic.subscribe(result => {
            this.dic = result as any;
        });
        this.dynaFB.buildFormFromClass(LeadRequest).then(form => (this.form = form));
    }
    ngOnInit() {}

    Close() {
        this.onClose.emit();
    }
}
