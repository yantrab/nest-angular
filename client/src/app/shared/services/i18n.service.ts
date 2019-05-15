import { Injectable, Inject } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class I18nService {
    constructor(@Inject('baseUrlI18n') private baseUrl: string) {
        this.language = 'he';
    }
    dic = new ReplaySubject();
    // tslint:disable-next-line:variable-name
    private _language: 'en' | 'he';
    dir: 'rtl' | 'ltr' = 'rtl';
    get language() {
        return this._language;
    }
    set language(value : 'en' | 'he') {
        this._language = value;
        this.dir = value === 'he' ? 'rtl' : 'ltr';
        fetch(this.baseUrl + '/' + value + '.json').then(async res => {
            this.dic.next(await res.json());
        });
    }
}
