import { Component, OnInit, Input, SimpleChanges, SimpleChange, OnChanges } from '@angular/core';
import { BaseFilterComponent } from '../base.component';

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
  }

  ngOnChanges(changes: SimpleChanges) {
    const options: SimpleChange = changes.options;
    if (options && JSON.stringify(options.previousValue) !== JSON.stringify(options.currentValue)) {
      this.settings.options.forEach(option => {
        option._query = this.paths.reduce((query, path) => query + ' ' + option[path], '');
      });
    }
  }
}
