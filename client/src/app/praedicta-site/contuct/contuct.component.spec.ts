import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContuctComponent } from './contuct.component';

describe('ContuctComponent', () => {
  let component: ContuctComponent;
  let fixture: ComponentFixture<ContuctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContuctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContuctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
