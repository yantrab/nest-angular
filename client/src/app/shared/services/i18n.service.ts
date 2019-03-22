import { Injectable, Inject } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class I18nService {
  constructor(@Inject('baseUrlI18n') private baseUrl: string) {
    this.language = 'en';
   }
  dic = new ReplaySubject();
  private _language: 'en' | 'he';
  dir: 'rtl' | 'ltr' = 'ltr';
  get language() { return this._language; }
  set language(value) {
    this._language = value;
    this.dir = value === 'he' ? 'rtl' : 'ltr';
    fetch(this.baseUrl + '/' + value + '.json').then(async res => {
      this.dic.next(await res.json());
    });
  }
}
