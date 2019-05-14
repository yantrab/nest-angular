import { Component, OnInit } from '@angular/core';
import { I18nService } from 'src/app/shared/services/i18n.service';
import { I18nRootObject } from 'src/api/i18n/site.i18n';

@Component({
  selector: 'p-praedicta-site',
  templateUrl: './praedicta-site.component.html',
  styleUrls: ['./praedicta-site.component.scss'],
})
export class PraedictaSiteComponent {
  dic: I18nRootObject;
  constructor(
    public i18nService: I18nService) {
    this.i18nService.dic.subscribe(d => this.dic = d as I18nRootObject);
  }

  changeDirection() {
    this.i18nService.language =  this.i18nService.language === 'en' ? 'he' : 'en';
  }
}
