import {startGenerateClientApi} from './api.generator'
import {startGenerateInterfaces} from './json2ts.generator'

startGenerateClientApi()
startGenerateInterfaces('client/src/assets/i18n/login','client/src/api/i18n/login.i18n.ts')
