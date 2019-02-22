import { I18nRootObject } from './shared/interfaces/i18n.interface'
export abstract class BaseComponent {
    dic: I18nRootObject;
    private _language: 'en' | 'he';
    dir: 'rtl' | 'ltr' = "ltr";
    get language() { return this._language }
    set language(value) {
        this._language = value;
        this.dir = value == 'he' ? 'rtl' : 'ltr';
        fetch('../assets/i18n/' + value + '.json').then(async res => {
            this.dic = await res.json()
        })
    }
    constructor() {
        this.language = 'en'
    }
}