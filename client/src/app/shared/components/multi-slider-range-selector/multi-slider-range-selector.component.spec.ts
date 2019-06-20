import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSliderRangeSelectorComponent } from './multi-slider-range-selector.component';

describe('MultiSliderRangeSelectorComponent', () => {
  let component: MultiSliderRangeSelectorComponent;
  let fixture: ComponentFixture<MultiSliderRangeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSliderRangeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSliderRangeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
