import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { Guard } from './guard';
import { Role } from '../../../shared';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'p-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  title = 'nest-angular';
}

const routes: Routes = [
  { path: '', redirectTo: 'login/app1', pathMatch: 'full' },
  { path: 'app1', loadChildren: 'src/app/app1/app1.module#App1Module', canActivate: [Guard], data: { roles: [Role.Admin, Role.app1] } },
  { path: 'app2', loadChildren: 'src/app/app2/app1.module#App2Module', canActivate: [Guard], data: { roles: [Role.Admin, Role.app2] } },
  { path: 'login/:site', loadChildren: 'src/app/auth/auth.module#AuthModule' },
  { path: '**', redirectTo: 'login/app1' }

];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, RouterModule.forRoot(routes)],
  bootstrap: [AppComponent],
  providers: [Guard, AuthService]
})
export class AppModule { }