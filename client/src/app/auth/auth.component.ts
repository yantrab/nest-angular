import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginRequest, signinRequest } from 'shared';
import { DynaFormBuilder, FormModel } from 'ng-dyna-form';
import { I18nService } from '../shared/services/i18n.service';
import { I18nRootObject } from 'src/api/i18n/login.i18n';
@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
    loginFormModel: FormModel<LoginRequest>;
    signinFormModel: FormModel<signinRequest>;
    dic: I18nRootObject;
    loginError;
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
        this.i18nService.dic.subscribe(result => {
            this.dic = result as any;
            this.loginFormModel = {
                appearance: 'outline',
                errorTranslations: this.dic.validation,
                fields: [
                    { key: 'email', placeHolder: this.dic.loginPage.email },
                    { placeHolder: this.dic.loginPage.password, key: 'password', type: 'password' },
                ],
                modelConstructor: LoginRequest,
                formSaveButtonTitle: this.dic.loginPage.login,
            };
            this.signinFormModel = {
                appearance: 'outline',
                errorTranslations: this.dic.validation,
                fields: [
                    { key: 'email', placeHolder: this.dic.loginPage.email },
                    { placeHolder: this.dic.loginPage.password, key: 'password', type: 'password' },
                    { placeHolder: this.dic.loginPage.rePassword, key: 'rePassword', type: 'password' },
                ],
                modelConstructor: signinRequest,
                model: { token: this.route.snapshot.params.token },
                formSaveButtonTitle: this.dic.loginPage.signin,
            };
        });
        this.currentSystem = this.route.snapshot.params.site;
        this.state = this.route.snapshot.params.state;
    }

    login(val) {
        this.authService.login(val).then(res => {
            if (res.status) {
                this.router.navigate([this.route.snapshot.params.site]).then();
            } else {
                this.loginError = this.dic.validation.loginFailedMsg;
            }
        });
    }

    signin(val) {
        this.authService.signin(val).then(() => {
            this.router.navigate([this.route.snapshot.params.site]).then();
        });
    }
}
