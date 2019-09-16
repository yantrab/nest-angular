import { AfterViewInit, Component, EventEmitter, Input, KeyValueDiffers, OnInit, Output, ViewChild } from '@angular/core';
import { BaseFilterComponent } from '../base.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteTrigger, MatInput } from '@angular/material';
import { UserFilter } from 'shared/models';
import { get } from 'lodash';

@Component({
    selector: 'p-autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent extends BaseFilterComponent implements OnInit, AfterViewInit {
    constructor(differs: KeyValueDiffers) {
        super(differs);
    }
    chips: boolean;
    filteredOptions: Observable<any[]>;
    input: FormControl = new FormControl();

    @Input() filterFn = query => {
        const result = this.queries.filter(q => q.q.includes(query.trim())).map(q => q.option);
        if (result.length || !this.freeText) {
            return result;
        }
        return [{ name: query + this.freeTextAddNewTitle } as UserFilter].concat(result);
    };

    @Input() appearance = 'outline';
    @Input() paths: string[] = ['name', '_id'];
    @Input() idPath = '_id';
    @Input() freeText: boolean;
    @Input() removeTitle = 'remove';
    @Input() canRemove: boolean;
    @Output() onRemove = new EventEmitter();
    @Input() freeTextAddNewTitle = 'Create New';
    @Input() keepOpen: boolean;
    @ViewChild(MatAutocompleteTrigger, null) inputAutocomplete: MatAutocompleteTrigger;
    @ViewChild(MatInput, null) matInput;
    @Input() displayFn = val => {
        return val ? val.name : '';
    };

    private queries = [];
    private filter = (value: any): string[] => {
        if (!value || typeof value !== 'string') {
            return this.options;
        }
        const filterValue = ' ' + value.toLowerCase();
        return this.filterFn(filterValue);
    };

    onSettingsChange(settings) {
        this.queries = [];
        if (this.canRemove) {
            this.options = this.settings.options;
        }
        this.options.forEach(option => {
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
        }
    }

    optionSelected(selected) {
        if (
            !this.settings.isMultiple ||
            !this.settings.selected ||
            !this.settings.selected.find(o => get(o, this.idPath) === get(selected, this.idPath))
        ) {
            super.optionSelected(selected);
        }
        if (this.keepOpen || this.settings.isMultiple) {
            setTimeout(() => {
                this.inputAutocomplete.openPanel();
                this.matInput._elementRef.nativeElement.focus();
            });
        } else {
            this.matInput._elementRef.nativeElement.blur();
        }
        setTimeout(() => {
            // this.input.setValue('');
        }, 100);
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.chips === undefined) {
            this.chips = this.settings.isMultiple;
        }
        this.filteredOptions = this.input.valueChanges.pipe(
            startWith<string | any>(''),
            map(name => (name ? this.filter(name) : this.options.slice())),
        );
        document.querySelectorAll('p-autocomplete .mat-form-field-flex')[0].addEventListener('click', ev => {
            this.clear(ev);
            const handler = () => {
                this.setInputSelectedValue();
                window.removeEventListener('click', handler);
            };
            window.addEventListener('click', handler);
        });
    }

    ngAfterViewInit() {
        if (this.keepOpen) {
            setTimeout(() => this.inputAutocomplete.openPanel());

            if (this.keepOpen) {
                window.addEventListener('click', () => this.inputAutocomplete.openPanel());
            }
        }
    }

    clear(ev) {
        this.input.setValue('');
        ev.stopPropagation();
    }

    remove(option: any, ev) {
        this.settings.options = this.settings.options.filter(o => get(o, this.idPath) !== get(option, this.idPath));
        this.onRemove.emit(option);
        // ev.stopPropagation();
        // ev.preventDefault();
    }

    setInputFocus() {
        setTimeout(() => this.matInput._elementRef.nativeElement.focus());
    }
}
