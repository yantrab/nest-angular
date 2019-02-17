import { Component, OnInit } from '@angular/core';
import { AuthController } from 'src/api/auth.controller';
import { Router } from '@angular/router';
import { FormGroup} from '@angular/forms';
import {LoginRequest} from 'shared'
import {DynaFormBuilder} from 'src/dyna-form/dyna-form.builder';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  api = new AuthController();
  loginRequest = new LoginRequest();
  dic = { login: 'login', email: 'email', password: 'password' }
  form :FormGroup;

  constructor(private router: Router, private dynaFB: DynaFormBuilder) {
    this.dynaFB.buildFormFromClass(LoginRequest).then(form => this.form = form);
  }

  login(e) {
    this.api.login({ email: this.form.value.email, password: this.form.value.password }).then(user => {
      this.router.navigate(['/' + window.location.pathname.replace('login/', ''), {}]);
    })
    e.preventDefault();
  }

}
