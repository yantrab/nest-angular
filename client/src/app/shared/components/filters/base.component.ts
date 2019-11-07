import { Input, Output, EventEmitter, KeyValueDiffers, DoCheck, KeyValueDiffer } from '@angular/core';
import { Filter } from 'shared';

export class BaseFilterComponent implements DoCheck {
    get isDisabled() {
        return !this.settings.lastChange && this.settings.isDisabled;
    }
    @Input() set options(ops) {
        this._options = ops;
        if (this.options.filter(o => !o.isDisabled).length === 1) {
            // this.settings.selected = this.options.filter(o => !o.isDisabled);
        }
    }
    get options() {
        return this._options || this.settings.options || this.settings._options;
    }

    get placeholder() {
        return (
            this.dic.placeholders[this.settings.placeholder] ||
            this.settings.placeholder ||
            this.dic.placeholders[this.settings.optionIdPath] ||
            this.settings.optionIdPath ||
            ''
        );
    }

    get title() {
        return this.dic.titles[this.settings.placeholder] || this.dic.titles[this.settings.optionIdPath] || '';
    }

    constructor(private _differs: KeyValueDiffers) {}
    @Input() set settings(settings: Filter) {
        this._settings = settings;
        if (!this._differ && settings) {
            this._differ = this._differs.find(settings).create();
        }
    }
    get settings(): Filter {
        return this._settings;
    }
    @Input() dic = { placeholders: {}, titles: {} };
    _options;
    private _differ: KeyValueDiffer<any, any>;
    _settings: Filter;
    @Output() selectedChange = new EventEmitter();
    ngDoCheck() {
        if (this._differ) {
            const changes = this._differ.diff(this._settings);
            if (changes) {
                this.onSettingsChange(changes);
            }
        }
    }
    onSettingsChange(changes) {}
    optionSelected(val) {
        this.settings.lastChange = true;
        if (this.settings.isMultiple) {
            if (!this.settings.selected) {
                this.settings.selected = [];
            }
            if (Array.isArray(val)) {
                this.settings.selected = val.length ? val : undefined;
            } else {
                this.settings.selected.push(val);
            }
        } else {
            this.settings.selected = val;
        }
        if (this.settings.selected) {
            delete this.settings.selected._query;
        }
        this.settings.isActive = !!this.settings.selected;
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
