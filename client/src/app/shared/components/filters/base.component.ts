import { Input } from '@angular/core';
import { Filter } from 'shared';
export class BaseFilterComponent {
    @Input()
    settings: Filter;
}
