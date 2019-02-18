import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
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
  loginRequest = new LoginRequest();
  dic = { login: 'login', email: 'email', password: 'password' }
  form :FormGroup;

  constructor(private router: Router, private dynaFB: DynaFormBuilder, private authService:AuthService) {
    this.dynaFB.buildFormFromClass(LoginRequest).then(form => this.form = form);
  }

  login(e) {
    this.authService.login(this.form.value).then(user => {
      this.router.navigate(['/' + window.location.pathname.replace('login/', ''), {}]);
    })
    e.preventDefault();
  }

}
