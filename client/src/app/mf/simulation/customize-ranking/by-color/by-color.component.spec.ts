import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ByColorComponent } from './by-color.component';

describe('ByColorComponent', () => {
  let component: ByColorComponent;
  let fixture: ComponentFixture<ByColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ByColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ByColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
