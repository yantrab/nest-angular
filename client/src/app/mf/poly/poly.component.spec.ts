import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolyComponent } from './poly.component';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../../shared/components/components.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('polyComponent', () => {
  let component: PolyComponent;
  let fixture: ComponentFixture<PolyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PolyComponent],
      imports: [
        CommonModule,
        ComponentsModule,
        BrowserAnimationsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
