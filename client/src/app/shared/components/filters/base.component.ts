import { Input, Output, EventEmitter } from '@angular/core';
import { Filter } from 'shared';
export class BaseFilterComponent {
    @Input() settings: Filter;
    @Output() selectedChange = new EventEmitter();
    optionSelected(val) {
        if (this.settings.isMultiple) {
            if (!this.settings.selected) { this.settings.selected = []; }
            this.settings.selected.push(val);
        } else {
            this.settings.selected = val;
        }

        this.selectedChange.emit(this.settings.selected);
    }

    optionDeSelected(val) {
        this.settings.selected = this.settings.selected.filter(s => s._id !== val._id);
        this.selectedChange.emit(this.settings.selected);
    }
}
