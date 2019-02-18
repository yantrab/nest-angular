import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
@Component({
  selector: 'p-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  title = 'nest-angular';
}

const routes: Routes = [
  { path: '', redirectTo: 'login/app1', pathMatch: 'full', canActivate:[]},
  { path: 'app1', loadChildren: 'src/app/app1/app1.module#App1Module' },
  { path: 'app2', loadChildren: 'src/app/app2/app1.module#App2Module' },
  { path: 'login/:site', loadChildren: 'src/app/auth/auth.module#AuthModule' }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [BrowserModule,BrowserAnimationsModule,RouterModule.forRoot(routes)],
  bootstrap: [AppComponent]
})
export class AppModule { }