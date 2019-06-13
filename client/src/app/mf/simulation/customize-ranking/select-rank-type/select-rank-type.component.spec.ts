import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRankTypeComponent } from './select-rank-type.component';

describe('SelectRankTypeComponent', () => {
  let component: SelectRankTypeComponent;
  let fixture: ComponentFixture<SelectRankTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectRankTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectRankTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
