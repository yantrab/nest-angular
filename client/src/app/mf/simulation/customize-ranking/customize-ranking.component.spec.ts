import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeRankingComponent } from './customize-ranking.component';

describe('CustomizeRankingComponent', () => {
  let component: CustomizeRankingComponent;
  let fixture: ComponentFixture<CustomizeRankingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizeRankingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
