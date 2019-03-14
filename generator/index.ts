import { startGenerateClientApi } from './api.gen';
import { startGenerateInterfaces } from 'nest-client-generator';
import * as config from './config';
startGenerateClientApi(config);
startGenerateInterfaces('client/src/assets/i18n/login', 'client/src/api/i18n/login.i18n.ts');
