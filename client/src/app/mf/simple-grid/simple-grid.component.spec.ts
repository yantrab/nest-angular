import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleGridComponent } from './simple-grid.component';

describe('SimpleGridComponent', () => {
  let component: SimpleGridComponent;
  let fixture: ComponentFixture<SimpleGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
