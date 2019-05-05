import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { LoginRequest } from 'shared';
import { DynaFormBuilder, validateAllFields } from 'ng-dyna-form';
import { I18nService } from '../shared/services/i18n.service';
import { I18nRootObject } from 'src/api/i18n/login.i18n';
@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
    // extends BaseComponent {
    form: FormGroup;
    dic: I18nRootObject;
    constructor(
        private router: Router,
        private dynaFB: DynaFormBuilder,
        private authService: AuthService,
        public i18nService: I18nService
    ) {
        this.i18nService.dic.subscribe(result => (this.dic = result as any));
        this.dynaFB
            .buildFormFromClass(LoginRequest)
            .then(form => (this.form = form));
    }

    login(e) {
        // On case that there is no changes in form
        validateAllFields(this.form);
        if (this.form.valid) {
            this.authService.login(this.form.value).then(() => {
                this.router.navigate([
                    '/' + window.location.pathname.replace('login/', ''),
                    {},
                ]);
            });
        }
        e.preventDefault();
    }
}
