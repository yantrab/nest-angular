import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MFComponent } from './mf.component';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../shared/components/components.module';
import { RouterModule } from '@angular/router';
import { FindFundComponent } from './findFund/findFund.component';
import { DumyComponent } from './dumy/dumy.component';

describe('MFComponent', () => {
    let component: MFComponent;
    let fixture: ComponentFixture<MFComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MFComponent, FindFundComponent, DumyComponent],
            imports: [
                CommonModule,
                ComponentsModule,
                RouterModule.forRoot([
                    { path: '', redirectTo: 'findFund', pathMatch: 'full' },
                    { path: 'findFund', component: FindFundComponent },
                    { path: 'dumy', component: DumyComponent },
                ]),
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MFComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
