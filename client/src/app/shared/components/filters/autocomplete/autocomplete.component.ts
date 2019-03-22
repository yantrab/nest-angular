import { Component, OnInit, Input, SimpleChanges, SimpleChange, OnChanges, } from '@angular/core';
import { BaseFilterComponent } from '../base.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'p-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent extends BaseFilterComponent implements OnInit, OnChanges {
  @Input() appearance = 'outline';
  chips: boolean;
  filteredOptions: any[];
  @Input() paths: string[] = ['name', '_id'];

  input: FormControl = new FormControl();
  @Input() displayFn = (val) => {
    return val ? val.name : '';
  }
  @Input() filter = (value: any): string[] => {
    if (!value || typeof value !== 'string') {
      return this.settings.options;
    }

    const filterValue = ' ' + value.toLowerCase();
    return this.settings.options.filter(option => option._query.toLowerCase().includes(filterValue));
  }
  inputChange(value: string) {
    this.filteredOptions = this.filter(value);
  }
  ngOnInit() {
    if (this.chips === undefined) {
      this.chips = this.settings.isMultiple;
    }
    this.filteredOptions = this.settings.options;
    this.setInputSelectedValue();
  }

  setInputSelectedValue() {
    if (!this.settings.isMultiple)
      this.input.setValue(this.settings.selected);
  }

  ngOnChanges(changes: SimpleChanges) {
    const change: SimpleChange = changes.settings;
    if (change && JSON.stringify(change.previousValue) !== JSON.stringify(change.currentValue)) {
      this.settings.options.forEach(option => {
        option._query = this.paths.reduce((query, path) => query + ' ' + option[path], '');
      });
    }
  }

  optionSelected(selected) {
    if (!this.settings.isMultiple) {
      document.getElementById('input').blur();
    }
    super.optionSelected(selected)
  }
}
