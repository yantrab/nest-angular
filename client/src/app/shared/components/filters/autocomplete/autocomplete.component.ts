import { Component, OnInit, Input, SimpleChanges, SimpleChange, OnChanges } from '@angular/core';
import { BaseFilterComponent } from '../base.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export const filterFn = (options: any[], query: string) => options.filter(option => option._query.toLowerCase().includes(query));

@Component({
  selector: 'p-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent extends BaseFilterComponent implements OnInit, OnChanges {
  chips: boolean;
  filteredOptions: Observable<any[]>;
  input: FormControl = new FormControl();
  @Input() filterFn = filterFn;
  @Input() appearance = 'outline';
  @Input() paths: string[] = ['name', '_id'];
  @Input() displayFn = (val) => {
    return val ? val.name : '';
  }

  filter = (value: any): string[] => {
    if (!value || typeof value !== 'string') {
      return this.settings.options;
    }

    const filterValue = ' ' + value.toLowerCase();
    return this.filterFn(this.settings.options, filterValue);
  }

  setInputSelectedValue() {
    if (!this.settings.isMultiple) {
      setTimeout(() => this.input.setValue(this.settings.selected), 1);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const change: SimpleChange = changes.settings;
    if (change && JSON.stringify(change.previousValue) !== JSON.stringify(change.currentValue)) {
      this.settings.options.forEach(option => {
        option._query = this.paths.reduce((query, path) => query + ' ' + option[path], '');
      });
    }
    this.setInputSelectedValue();
    window.addEventListener('click', () => this.setInputSelectedValue());
  }

  optionSelected(selected) {
    if (!this.settings.isMultiple) {
      document.getElementById('input').blur();
    }
    super.optionSelected(selected);
  }

  ngOnInit(): void {
    if (this.chips === undefined) {
      this.chips = this.settings.isMultiple;
    }
    this.filteredOptions = this.input.valueChanges
      .pipe(
        startWith<string | any>(''),
        map(name => name ? this.filter(name) : this.settings.options.slice())
      );
  }
  clear(ev) {
    this.input.setValue('');
    ev.stopPropagation();
  }
}
