import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardComponent } from './keyboard.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material/material.module';

describe('KeyboardComponent', () => {
  let component: KeyboardComponent;
  let fixture: ComponentFixture<KeyboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KeyboardComponent], imports: [MaterialModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
