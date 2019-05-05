import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PraedictaSiteComponent } from './praedicta-site.component';

describe('PraedictaSiteComponent', () => {
  let component: PraedictaSiteComponent;
  let fixture: ComponentFixture<PraedictaSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PraedictaSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PraedictaSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
