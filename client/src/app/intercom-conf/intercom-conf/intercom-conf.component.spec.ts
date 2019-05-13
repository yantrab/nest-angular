import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntercomConfComponent } from './intercom-conf.component';

describe('IntercomConfComponent', () => {
  let component: IntercomConfComponent;
  let fixture: ComponentFixture<IntercomConfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntercomConfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntercomConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
