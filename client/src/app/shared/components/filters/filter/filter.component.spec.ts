import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { MaterialModule } from '../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CheckboxFilter, DropdownFilter, Filter } from 'shared';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { Component } from '@angular/core';


@Component({
  selector: `host-component`,
  template: `<p-filter [filter]="filter"></p-filter>`
})
class TestHostComponent {
  filter: Filter; // = { options: [{ _id: 1, name: 'name1' }, { _id: 2, name: 'name2' }], selected: { _id: 2, name: 'name2' } };
  constructor() {
// tslint:disable-next-line: max-line-length
    this.filter = new CheckboxFilter({ options: [{ _id: '1', name: 'name1' }, { _id: '2', name: 'name2' }], selected: { _id: '2', name: 'name2' } });
  }
}



describe('FilterComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterComponent, CheckboxComponent, DropdownComponent, TestHostComponent],
      imports: [MaterialModule, BrowserAnimationsModule, FlexLayoutModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;

  });

  it('should create check box', () => {
    component.filter =
      new CheckboxFilter({ options: [{ _id: '1', name: 'name1' }, { _id: '2', name: 'name2' }], selected: { _id: '2', name: 'name2' } });
    fixture.detectChanges();
    const elcheckbox = fixture.debugElement.nativeElement.querySelector('p-checkbox');
    const eldropdown = fixture.debugElement.nativeElement.querySelector('p-dropdown');
    expect(elcheckbox).toBeDefined();
    expect(eldropdown).toBeNull();

  });

  it('should create dropdown box', () => {
    component.filter =
      new DropdownFilter({ options: [{ _id: '1', name: 'name1' }, { _id: '2', name: 'name2' }], selected: { _id: '2', name: 'name2' } });
    fixture.detectChanges();
    const elcheckbox = fixture.debugElement.nativeElement.querySelector('p-checkbox');
    const eldropdown = fixture.debugElement.nativeElement.querySelector('p-dropdown');
    expect(eldropdown).toBeDefined();
    expect(elcheckbox).toBeNull();
  });
});
