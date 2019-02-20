
import { I18nRootObject } from './shared/interfaces/i18n.interface'
import { get } from '../api/http.service'
export class BaseComponent {
    dic: I18nRootObject;
    private _language: 'en' | 'he';
    dir: 'rtl' | 'ltr' = "ltr";
    get language() { return this._language }
    set language(value) {
        this._language = value;
        this.dir = value == 'he' ? 'rtl' : 'ltr';
        get('../assets/i18n/' + value + '.json').then(json => this.dic = <any>json)
    }
    constructor() {
        this.language = 'en'
    }
}