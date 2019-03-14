import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DropdownComponent } from './dropdown.component';
import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: `host-component`,
  template: `<p-dropdown [settings]="settings"></p-dropdown>`
})
class TestHostComponent {
  settings = { options: [{ _id: 1, name: 'name1' }, { _id: 2, name: 'name2' }], selected: { _id: 2, name: 'name2' } };
}

describe('Drodown Component', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent, DropdownComponent],
      imports: [MaterialModule, BrowserAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should show placeholder', () => {
    const el: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    const p = el.querySelector('.mat-form-field-label');
    expect(p.textContent).toEqual('name2');
  });
});
