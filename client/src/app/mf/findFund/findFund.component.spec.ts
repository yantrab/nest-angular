import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindFundComponent } from './findFund.component';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../../shared/components/components.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('polyComponent', () => {
    let component: FindFundComponent;
    let fixture: ComponentFixture<FindFundComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FindFundComponent],
            imports: [CommonModule, ComponentsModule, BrowserAnimationsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FindFundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
