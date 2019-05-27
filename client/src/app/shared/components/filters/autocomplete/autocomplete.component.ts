import { AfterViewInit, Component, Input, KeyValueDiffers, OnInit, ViewChild } from '@angular/core';
import { BaseFilterComponent } from '../base.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material';
import { NEW } from '../../../../mf/mf.service';
import { UserFilter } from 'shared/models';

@Component({
    selector: 'p-autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent extends BaseFilterComponent implements OnInit, AfterViewInit {
    constructor(differs: KeyValueDiffers) {
        super(differs);
        window.addEventListener('click', () => this.setInputSelectedValue());
    }
    chips: boolean;
    filteredOptions: Observable<any[]>;
    input: FormControl = new FormControl();
    @Input() filterFn = query => {
        const result = this.queries.filter(q => q.q.includes(query)).map(q => q.option);
        if (result.length || !this.freeText) {
            return result;
        }
        return [{ name: query + NEW } as UserFilter].concat(result);
    };

    @Input() appearance = 'outline';
    @Input() paths: string[] = ['name', '_id'];
    @Input() freeText: boolean;
    @Input() keepOpen: boolean;
    @ViewChild(MatAutocompleteTrigger) inputAutocomplete: MatAutocompleteTrigger;
    @Input() displayFn = val => {
        return val ? val.name : '';
    };

    private queries = [];
    private filter = (value: any): string[] => {
        if (!value || typeof value !== 'string') {
            return this.settings.options;
        }
        const filterValue = ' ' + value.toLowerCase();
        return this.filterFn(filterValue);
    };

    onSettingsChange(settings) {
        this.settings.options.forEach(option => {
            this.queries.push({
                q: this.paths.reduce((query, path) => query + ' ' + (option[path] || ''), '').toLowerCase(),
                option,
            });
        });
        this.setInputSelectedValue();
    }

    setInputSelectedValue() {
        if (!this.settings.isMultiple) {
            this.input.setValue(this.settings.selected);
            if (this.keepOpen) {
                setTimeout(() => this.inputAutocomplete.openPanel(), 1);
            }
        }
    }

    optionSelected(selected) {
        if (!this.settings.isMultiple) {
            document.getElementById('input').blur();
        }
        super.optionSelected(selected);
        if (this.keepOpen) {
            setTimeout(() => this.inputAutocomplete.openPanel(), 1);
        }
    }

    ngOnInit(): void {
        if (this.chips === undefined) {
            this.chips = this.settings.isMultiple;
        }
        this.filteredOptions = this.input.valueChanges.pipe(
            startWith<string | any>(''),
            map(name => (name ? this.filter(name) : this.settings.options.slice())),
        );
        document.querySelectorAll('p-autocomplete .mat-form-field-flex')[0].addEventListener('click', ev => this.clear(ev));
    }

    ngAfterViewInit() {
        if (this.keepOpen) {
            this.inputAutocomplete.openPanel();
        }
    }

    clear(ev) {
        this.input.setValue('');
        ev.stopPropagation();
    }
}
