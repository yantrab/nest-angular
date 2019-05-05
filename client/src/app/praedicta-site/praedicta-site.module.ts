import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PraedictaSiteComponent } from './praedicta-site/praedicta-site.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { I18nService } from '../shared/services/i18n.service';

@NgModule({
  declarations: [PraedictaSiteComponent],
  providers: [I18nService, { provide: 'baseUrlI18n', useValue: '../../assets/i18n/site' }],
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule.forChild(
      [
        {
          path: '', component: PraedictaSiteComponent,
          // children: [
          //   { path: '', redirectTo: 'dumy' },
          //   { path: 'poly', component: PolyComponent },
          //   { path: 'dumy', component: DumyComponent },
          // ]
        },
      ])
  ]
})
export class PraedictaSiteModule { }
