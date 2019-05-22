import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemsManagerComponent } from './systems-manager.component';

describe('SystemsManagerComponent', () => {
  let component: SystemsManagerComponent;
  let fixture: ComponentFixture<SystemsManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemsManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
