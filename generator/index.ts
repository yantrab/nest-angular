import {startGenerateClientApi} from 'nest-client-generator'
import {startGenerateInterfaces} from 'nest-client-generator'

startGenerateClientApi()
startGenerateInterfaces('client/src/assets/i18n/login','client/src/api/i18n/login.i18n.ts')
