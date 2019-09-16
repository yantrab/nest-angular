import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { LoginRequest, signinRequest } from 'shared';
import { DynaFormBuilder, validateAllFields } from 'ng-dyna-form';
import { I18nService } from '../shared/services/i18n.service';
import { I18nRootObject } from 'src/api/i18n/login.i18n';
import { MyErrorStateMatcher } from './MyErrorStateMatcher';
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
    hover: boolean = false;
    state: 'login' | 'signin';
    currentSystem: 'macro' | 'mf';
    settings;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dynaFB: DynaFormBuilder,
        private authService: AuthService,
        public i18nService: I18nService,
    ) {
        this.settings = {
            macro: {
                background: '#eeeeee',
                button: '#ffc400',
                backgroundHover: 'rgba(255, 220, 0, 0.6)',
            },
            mf: {
                button: '#1e90ff',
                backgroundHover: 'rgb(127, 203, 247)',
            },
        };
        this.i18nService.dic.subscribe(result => (this.dic = result as any));

        this.dynaFB.buildFormFromClass(LoginRequest).then(form => (this.form = form));
        this.dynaFB
            .buildFormFromClass(signinRequest, { token: this.route.snapshot.params.token })
            .then(form => (this.signinFrom = form));
        this.currentSystem = window.location.pathname.split('/')[2] as any;
        this.state = window.location.pathname.split('/')[1] as any;
    }

    login(e) {
        // On case that there is no changes in form
        validateAllFields(this.form);
        if (this.form.valid) {
            this.authService.login(this.form.value).then(res => {
                if (res.status) {
                    this.router.navigate([this.route.snapshot.params.site]).then();
                } else {
                    this.form.controls.password.setErrors({ 0: this.dic.validation.loginFailedMsg });
                }
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
                this.router.navigate([this.route.snapshot.params.site]).then();
            });
        }
        e.preventDefault();
    }
}
