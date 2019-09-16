import { Input, Output, EventEmitter, KeyValueDiffers, DoCheck, KeyValueDiffer } from '@angular/core';
import { Filter } from 'shared';

export class BaseFilterComponent implements DoCheck {
    @Input() dic = { placeholders: {}, titles: {} };
    options;
    private _dataSource;
    @Input() set dataSource(data) {
        if (this.justChange) {
            this.justChange = false;
            return;
        }
        this._dataSource = data;
        if (this.settings) {
            this.options = this.settings.options || this.settings.getOptions(data);
        }
    }
    get dataSource() {
        return this._dataSource;
    }

    ngOnInit(): void {
        this.options = this.settings.options || this.settings.getOptions(this._dataSource);
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
    justChange = false;
    private _differ: KeyValueDiffer<any, any>;
    _settings: Filter;
    @Input() set settings(settings: Filter) {
        this._settings = settings;
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
        this.justChange = true;
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
