import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineWeightsByGroupColorsComponent } from './define-weights-by-group-colors.component';

describe('DefineWeightsByGroupColorsComponent', () => {
  let component: DefineWeightsByGroupColorsComponent;
  let fixture: ComponentFixture<DefineWeightsByGroupColorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineWeightsByGroupColorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineWeightsByGroupColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
