import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { Guard } from './guard';
import { App } from 'shared';
import { AuthService } from './auth/auth.service';
import { InterceptorsService } from './shared/services/interceptors.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APIService } from 'src/api/http.service';
import { GestureConfig } from '@angular/material';
const isCordovaApp = Object(window).cordova != null;
@Component({
    selector: 'p-root',
    template: '<router-outlet></router-outlet>',
})
export class AppComponent {}

const routes: Routes = [
    { path: '', redirectTo: 'intercom-admin', pathMatch: 'full' },
    { path: 'login/:site', loadChildren: 'src/app/auth/auth.module#AuthModule' },
    { path: 'signin/:site/:token', loadChildren: 'src/app/auth/auth.module#AuthModule' },
    { path: 'admin/:site', loadChildren: 'src/app/admin/admin.module#AdminModule' },
    {
        path: 'intercom-admin',
        loadChildren: 'src/app/intercom-conf/intercom-conf.module#IntercomConfModule',
        canActivate: [Guard],
        data: { app: App.tador },
    },
    { path: 'intercom', loadChildren: 'src/app/intercom/intercom.module#IntercomModule' },
    { path: 'webrtc', loadChildren: 'src/app/webRTC/webRTC.module#App2Module' },
    { path: '**', redirectTo: 'login/intercom-admin' },
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
        { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    ],
})
export class AppModule {}
