import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MFComponent } from './mf.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../shared/components/components.module';
import { FindFundComponent } from './findFund/findFund.component';
import { SimulationComponent } from './simulation/simulation.component';
import { MFController } from 'src/api/mf.controller';
import { FiltersComponent } from './findFund/filters/filters.component';
import { MfService } from './mf.service';
@NgModule({
    declarations: [MFComponent, FindFundComponent, SimulationComponent, FiltersComponent],
    imports: [
        CommonModule,
        ComponentsModule,
        RouterModule.forChild([
            {
                path: '',
                component: MFComponent,
                children: [
                    { path: '', redirectTo: 'find' },
                    { path: 'find', component: FindFundComponent },
                    { path: 'simulation', component: SimulationComponent },
                ],
            },
        ]),
    ],
    providers: [MFController, MfService, { provide: 'baseUrlI18n', useValue: '../../assets/i18n/mf' }],
})
export class MFModule {}
