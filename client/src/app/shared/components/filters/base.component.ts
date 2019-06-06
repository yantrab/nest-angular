import { Input, Output, EventEmitter, KeyValueDiffers, DoCheck, OnChanges, KeyValueDiffer } from '@angular/core';
import { Filter } from 'shared';

export class BaseFilterComponent implements DoCheck {
    constructor(private _differs: KeyValueDiffers) {}
    private _differ: KeyValueDiffer<any, any>;
    _settings: Filter;
    @Input() set settings(settings: Filter) {
        this._settings = settings;
        // clone
        // this._settings.options = this._settings.options.map(option => Object.assign({}, new Option(...option)));
        if (!this._differ && settings) {
            this._differ = this._differs.find(settings).create();
        }
    }
    get settings(): Filter {
        return this._settings;
    }
    ngDoCheck() {
        if (this._differ) {
            const changes = this._differ.diff(this._settings);
            if (changes) {
                this.onSettingsChange(changes);
            }
        }
    }
    @Output() selectedChange = new EventEmitter();
    onSettingsChange(changes) {}
    optionSelected(val) {
        if (this.settings.isMultiple) {
            if (!this.settings.selected) {
                this.settings.selected = [];
            }
            this.settings.selected.push(val);
        } else {
            this.settings.selected = val;
        }
        delete this.settings.selected._query;
        this.settings.isActive = true;
        this.selectedChange.emit(this.settings.selected);
    }

    optionDeSelected(val) {
        this.settings.selected = this.settings.selected.filter(s => s._id !== val._id);
        if (this.settings.isMultiple && !this.settings.selected.length) {
            this.settings.selected = undefined;
        }
        this.selectedChange.emit(this.settings.selected);
    }
}
