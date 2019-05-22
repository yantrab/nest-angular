import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PraedictaSiteComponent } from './praedicta-site/praedicta-site.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { I18nService } from '../shared/services/i18n.service';
import { SystemComponent } from './system/system.component';
import { SystemsManagerComponent } from './systems-manager/systems-manager.component';
import { ContentComponent } from './content/content.component';
@Component({
    selector: 'p-site',
    template: '<router-outlet></router-outlet>',
    styleUrls: ['./site.component.scss'],
})
export class SiteComponent {}

@NgModule({
    declarations: [SiteComponent, PraedictaSiteComponent, SystemComponent, SystemsManagerComponent, ContentComponent],
    providers: [I18nService, { provide: 'baseUrlI18n', useValue: '../../assets/i18n/site' }],
    imports: [
        CommonModule,
        FlexLayoutModule,
        RouterModule.forChild([
            {
                path: '',
                component: SiteComponent,
                children: [
                    {
                        path: '',
                        component: PraedictaSiteComponent,
                    },
                    {
                        path: ':site',
                        component: SystemsManagerComponent,
                    },
                ],
            },
        ]),
    ],
})
export class PraedictaSiteModule {}
