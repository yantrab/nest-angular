import { json2ts } from 'json-ts';
const json =  require('../client/src/assets/i18n/en.json')
import {writeFileSync, mkdirSync} from 'fs'
const dest = './client/src/app/shared/interfaces'
export const startGenerateInterfaces = () =>{
    mkdirSync(dest, { recursive: true });
    writeFileSync(dest + '/i18n.interface.ts', json2ts(JSON.stringify(json),{prefix:'I18n'}).replace(/interface/g,'export interface')) 
}