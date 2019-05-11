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
    template: `
        <router-outlet></router-outlet>
    `,
})
export class AppComponent {
    title = 'nest-angular';
}

const routes: Routes = [
    { path: '', redirectTo: 'praedicta', pathMatch: 'full' },
    // { path: '', redirectTo: 'login/app1', pathMatch: 'full' },
    // { path: 'app1', loadChildren: 'src/app/app1/app1.module#App1Module' },
    {
        path: 'app1', loadChildren: 'src/app/mf/mf.module#MFModule', canActivate: [Guard],
        data: { app: App.mf }
    },
    { path: 'praedicta', loadChildren: 'src/app/praedicta-site/praedicta-site.module#PraedictaSiteModule' },

    { path: 'login/:site', loadChildren: 'src/app/auth/auth.module#AuthModule' },

    { path: 'intercom-admin', loadChildren: 'src/app/intercom-conf/intercom-conf.module#IntercomConfModule' },
    { path: 'intercom', loadChildren: 'src/app/intercom/intercom.module#IntercomModule' },
    { path: 'macro', loadChildren: 'src/app/macro/macro.module#MacroModule', canActivate: [Guard], data: { app: App.macro } },

    { path: '**', redirectTo: 'praedicta' },

    { path: '**', redirectTo: 'login/mf' },
];

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes, { useHash: isCordovaApp }),
        HttpClientModule,
    ],
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
export class AppModule { }
