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
import { CustomizeRankingComponent } from './simulation/customize-ranking/customize-ranking.component';
import { SelectRankTypeComponent } from './simulation/customize-ranking/select-rank-type/select-rank-type.component';
import { FreelyComponent } from './simulation/customize-ranking/freely/freely.component';
import { ByColorComponent } from './simulation/customize-ranking/by-color/by-color.component';
import { SimpleGridComponent } from './simple-grid/simple-grid.component';
import { FundCardComponent } from './simple-grid/fund-card/fund-card.component';
import { CustomizeTemplateComponent } from './simulation/customize-ranking/customize-template/customize-template.component';
import { DefineWeightsByGroupColorsComponent } from './simulation/customize-ranking/by-color/define-weights-by-group-colors/define-weights-by-group-colors.component';
@NgModule({
    declarations: [MFComponent, FindFundComponent, SimulationComponent, FiltersComponent, CustomizeRankingComponent, SelectRankTypeComponent, FreelyComponent, ByColorComponent, SimpleGridComponent, FundCardComponent, CustomizeTemplateComponent, DefineWeightsByGroupColorsComponent],
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
