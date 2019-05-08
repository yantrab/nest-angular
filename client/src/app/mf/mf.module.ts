import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MFComponent } from './mf.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../shared/components/components.module';
import { PolyComponent } from './poly/poly.component';
import { DumyComponent } from './dumy/dumy.component';
import { MFController } from 'src/api/mf.controller';
import { FiltersComponent } from './poly/filters/filters.component';
import { MfService } from './mf.service';
@NgModule({
    declarations: [MFComponent, PolyComponent, DumyComponent, FiltersComponent],
    imports: [
        CommonModule,
        ComponentsModule,
        RouterModule.forChild([
            {
                path: '',
                component: MFComponent,
                children: [
                    { path: '', redirectTo: 'dumy' },
                    { path: 'poly', component: PolyComponent },
                    { path: 'dumy', component: DumyComponent },
                ],
            },
        ]),
    ],
    providers: [MFController, MfService],
})
export class MFModule {}
