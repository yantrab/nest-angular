import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { LoginRequest, signinRequest } from 'shared';
import { DynaFormBuilder, validateAllFields } from 'ng-dyna-form';
import { I18nService } from '../shared/services/i18n.service';
import { I18nRootObject } from 'src/api/i18n/login.i18n';
import { MyErrorStateMatcher } from './MyErrorStateMatcher';
import { forEachComment } from 'tslint';
@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
    matcher = new MyErrorStateMatcher();
    form: FormGroup;
    signinFrom: FormGroup;
    dic: I18nRootObject;
    state: 'login' | 'signin';
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dynaFB: DynaFormBuilder,
        private authService: AuthService,
        public i18nService: I18nService,
    ) {
        this.i18nService.dic.subscribe(result => (this.dic = result as any));

        this.dynaFB.buildFormFromClass(LoginRequest).then(form => (this.form = form));
        this.dynaFB
            .buildFormFromClass(signinRequest, { token: this.route.snapshot.params.token })
            .then(form => (this.signinFrom = form));

        this.state = window.location.pathname.split('/')[1] as any;
    }

    login(e) {
        // On case that there is no changes in form
        validateAllFields(this.form);
        if (this.form.valid) {
            this.authService.login(this.form.value).then(() => {
                this.router.navigate(['/' + window.location.pathname.replace('login/', ''), {}]).then();
            });
        }
        e.preventDefault();
    }

    signin(e) {
        // On case that there is no changes in form
        validateAllFields(this.signinFrom);
        if (this.signinFrom.valid) {
            //
            this.authService.signin(this.signinFrom.value).then(() => {
                this.router.navigate(['/' + window.location.pathname.replace('signin/', 'login/'), {}]);
            });
        }
        e.preventDefault();
    }
}
