import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialFilterGridComponent } from './special-filter-grid.component';

describe('SpecialFilterGridComponent', () => {
  let component: SpecialFilterGridComponent;
  let fixture: ComponentFixture<SpecialFilterGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialFilterGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialFilterGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
