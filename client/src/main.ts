import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/starter.module';
import { environment } from './environments/environment';
import 'reflect-metadata';
import 'hammerjs';
if (environment.production) {
  enableProdMode();
}

// let onDeviceReady = () => {
platformBrowserDynamic().bootstrapModule(AppModule)
<<<<<<< HEAD
  .catch(err => console.error(err));
=======
    .catch(err => console.error(err));
>>>>>>> 06f006fe554a7754c5152fc1d723d57544badfba
// };
// document.addEventListener('deviceready', onDeviceReady, false);


