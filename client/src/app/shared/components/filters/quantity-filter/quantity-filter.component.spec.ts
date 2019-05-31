import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityFilterComponent } from './quantity-filter.component';

describe('QuantityFilterComponent', () => {
  let component: QuantityFilterComponent;
  let fixture: ComponentFixture<QuantityFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantityFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
