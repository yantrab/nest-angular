import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentsModule } from '../../components.module';
import { Filter } from 'shared';
@Component({
  selector: `host-component`,
  template: `<p-autocomplete [settings]="settings"></p-autocomplete>`
})

class TestHostComponent {
  settings: Filter = {
    placeholder: 'placeholder',
    options:
      [{ _id: 1, name: 'name1' }, { _id: 2, name: 'name2' }],
    selected: { _id: 2, name: 'name2' }
  };
}

fdescribe('autocomplete Component', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [MaterialModule, BrowserAnimationsModule, ComponentsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should show placeholder', () => {
    const el: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    const input = el.querySelector('.mat-input-element');

    expect(input.getAttribute('placeholder')).toEqual('placeholder');
  });

  it('should show placeholder', () => {
    const el: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    const input = el.querySelector('.mat-input-element');
    expect(input.getAttribute('placeholder')).toEqual('placeholder');
  });
});

