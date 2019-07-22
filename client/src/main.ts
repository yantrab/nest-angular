import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/starter.module';
import { environment } from './environments/environment';
import 'reflect-metadata';
import './polyfills';
if (environment.production) {
    enableProdMode();
}

//// let onDeviceReady = () => {
platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
// };
// document.addEventListener('deviceready', onDeviceReady, false);
