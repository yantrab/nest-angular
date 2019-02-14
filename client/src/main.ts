import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AuthModule } from './auth/auth.module';
import { environment } from './environments/environment';
import 'reflect-metadata'
import 'hammerjs';
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AuthModule)
  .catch(err => console.error(err));
