import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {MFComponent } from './mf.component';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../shared/components/components.module';
import { RouterModule } from '@angular/router';
import { PolyComponent } from './poly/poly.component';
import { DumyComponent } from './dumy/dumy.component';

describe('mfComponent', () => {
  let component:MFComponent;
  let fixture: ComponentFixture<mfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [mfComponent, PolyComponent, DumyComponent],
      imports: [
        CommonModule,
        ComponentsModule,
        RouterModule.forRoot(
          [
            { path: '', redirectTo: 'poly', pathMatch: 'full' },
            { path: 'poly', component: PolyComponent },
            { path: 'dumy', component: DumyComponent }
          ])
        ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(mfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
