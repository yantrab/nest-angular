import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { App1Component } from './app1.component';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../shared/components/components.module';
import { RouterModule } from '@angular/router';
import { PolyComponent } from './poly/poly.component';
import { DumyComponent } from './dumy/dumy.component';

fdescribe('App1Component', () => {
  let component: App1Component;
  let fixture: ComponentFixture<App1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [App1Component, PolyComponent, DumyComponent],
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
    fixture = TestBed.createComponent(App1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
