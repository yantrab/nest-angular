import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialFilterComponent } from './special-filter.component';

describe('SpecialFilterComponent', () => {
  let component: SpecialFilterComponent;
  let fixture: ComponentFixture<SpecialFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
