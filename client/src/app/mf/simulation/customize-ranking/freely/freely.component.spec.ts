import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelyComponent } from './freely.component';

describe('FreelyComponent', () => {
  let component: FreelyComponent;
  let fixture: ComponentFixture<FreelyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
