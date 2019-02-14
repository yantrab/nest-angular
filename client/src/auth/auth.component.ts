import { Component, OnInit } from '@angular/core';
import { AuthController } from '../api/auth.controller';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  api = new AuthController();
  dic = { login: 'login', email: 'email', password: 'password' }
  form = new FormGroup({
    email: new FormControl(undefined, [Validators.email, Validators.required]),
    password: new FormControl(undefined, [Validators.minLength(6), Validators.required]),
  })

  constructor(private router: Router) {
  }

  login() {
    this.api.login({ email: this.form.value.email, password: this.form.value.password }).then(user => {
      console.log(user.FullName)
      this.router.navigate(['/' + window.location.pathname.replace('/auth/login/', ''), {}]);
    })
  }

}
