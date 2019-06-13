import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { Guard } from './guard';
import { App } from 'shared';
import { AuthService } from './auth/auth.service';
import { InterceptorsService } from './shared/services/interceptors.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APIService } from 'src/api/http.service';
const isCordovaApp = Object(window).cordova != null;
@Component({
    selector: 'p-root',
    template: '<router-outlet></router-outlet>',
})
export class AppComponent {}

const routes: Routes = [
    { path: '', redirectTo: 'mf/simulation', pathMatch: 'full' },
    {
        path: 'mf',
        loadChildren: () => import('src/app/mf/mf.module').then(m => m.MFModule),
        canActivate: [Guard],
        data: { app: App.mf },
    },
    {
        path: 'praedicta',
        loadChildren: () => import('src/app/praedicta-site/praedicta-site.module').then(m => m.PraedictaSiteModule),
    },
    { path: 'login/:site', loadChildren: 'src/app/auth/auth.module#AuthModule' },
    { path: 'signin/:site/:token', loadChildren: 'src/app/auth/auth.module#AuthModule' },
    { path: 'admin/:site', loadChildren: 'src/app/admin/admin.module#AdminModule' },
    { path: 'intercom-admin', loadChildren: 'src/app/intercom-conf/intercom-conf.module#IntercomConfModule' },
    { path: 'intercom', loadChildren: 'src/app/intercom/intercom.module#IntercomModule' },
    { path: 'webrtc', loadChildren: 'src/app/webRTC/webRTC.module#App2Module' },
    {
        path: 'macro',
        loadChildren: 'src/app/macro/macro.module#MacroModule',
        canActivate: [Guard],
        data: { app: App.macro },
    },
    { path: '**', redirectTo: 'login/mf' },
];

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, BrowserAnimationsModule, RouterModule.forRoot(routes, { useHash: isCordovaApp }), HttpClientModule],
    bootstrap: [AppComponent],
    providers: [
        Guard,
        AuthService,
        APIService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorsService,
            multi: true,
        },
    ],
})
export class AppModule {}
