import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PraedictaSiteComponent } from './praedicta-site/praedicta-site.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { I18nService } from '../shared/services/i18n.service';
import { SystemComponent } from './system/system.component';
import { SystemsManagerComponent } from './systems-manager/systems-manager.component';
import { ContentComponent } from './content/content.component';
import { ImageComponent } from './image/image.component';
import { ComponentsModule } from '../shared/components/components.module';
import { DynaFormModule } from 'ng-dyna-form';
import { ContuctComponent } from './contuct/contuct.component';
@Component({
    selector: 'p-site',
    template: '<router-outlet></router-outlet>',
    styleUrls: ['./site.component.scss'],
})
export class SiteComponent {}

@NgModule({
    declarations: [
        SiteComponent,
        PraedictaSiteComponent,
        SystemComponent,
        SystemsManagerComponent,
        ContentComponent,
        ImageComponent,
        ContuctComponent,
    ],
    providers: [I18nService, { provide: 'baseUrlI18n', useValue: '../../assets/i18n/site' }],
    imports: [
        ComponentsModule,

        DynaFormModule,
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
