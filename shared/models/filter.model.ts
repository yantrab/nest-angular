import { Poly, Entity } from './Entity';
import { get, uniqBy } from 'lodash';
import { IsOptional, IsBoolean, IsString, ValidateNested, IsArray } from 'class-validator';
import * as Filters from './filter.model';
import { getDistribution } from '../utils';

export class Filter extends Poly {
    @IsOptional() options?: any[];

    @IsOptional() selected?: any;

    @IsOptional() @IsString() optionNamePath?: string;
    @IsOptional() @IsString() optionIdPath?: string;

    @IsBoolean() @IsOptional() isMultiple?: boolean;
    @IsOptional() @IsBoolean() isActive?: boolean;
    @IsOptional() @IsBoolean() show?: boolean;
    @IsOptional() @IsString() placeholder?: string;
    @IsString() @IsOptional() format?: string;
    constructor(filter?: Partial<Filter>) {
        super(filter);
        this.show = this.show === undefined ? true : this.show;
        if (filter && filter.kind && this.constructor.name === 'Filter') return new Filters[filter.kind](filter);
    }
    doFilter(items: any[]): any[] {
        return items;
        // throw new Error('not implemented');
    }
    getOptions(items) {
        return (
            this.options ||
            uniqBy(
                items.map(item => ({
                    _id: get(item, this.optionIdPath),
                    name: get(item, this.optionNamePath || this.optionIdPath),
                })),
                '_id',
            )
        );
    }
}

export class CheckboxFilter extends Filter {
    doFilter(items: any[]): any[] {
        return items.filter(item => this.selected.find(s => s._id === get(item, this.optionIdPath)));
    }

    getOptions(items) {
        return (
            this.options ||
            uniqBy(items.map(item => ({ _id: get(item, this.optionIdPath), name: get(item, this.optionIdPath) })), '_id')
        );
    }
}
export class ComboboxFilter extends Filter {
    doFilter(items: any[]): any[] {
        return items.filter(item => this.selected._id === get(item, this.optionIdPath));
    }

    createOptions(items) {
        return (
            this.options ||
            uniqBy(items.map(item => ({ _id: get(item, this.optionIdPath), name: get(item, this.optionIdPath) })), '_id')
        );
    }
}
export class DateRangeComboFilter extends Filter {
    doFilter(items: any[]): any[] {
        return items.filter(item => {
            const date = +new Date(get(item, this.optionIdPath));
            return +new Date() - this.selected._id - date >= 0;
        });
    }
}
export class DropdownFilter extends Filter {
    doFilter(items: any[]): any[] {
        return items;
    }
}
export class QuantityFilter extends Filter {
    doFilter(items: any[]): any[] {
        return items.filter(item => {
            const val = get(item, this.optionIdPath);
            return val >= this.selected[0] && val <= this.selected[1];
        });
    }

    createOptions(items) {
        return this.options || getDistribution(items.map(item => get(item, this.optionIdPath)));
    }
}
export class AutocompleteFilter extends Filter {
    doFilter(items: any[]): any[] {
        const ids = this.isMultiple ? this.selected.map(s => s._id) : [this.selected._id];
        return items.filter(item => ids.includes(get(item, this.optionIdPath)));
    }
}

export class SpecialFilter extends Filter {
    constructor(filter: Partial<SpecialFilter>) {
        super(filter);
        if (!filter) {
            return;
        }
        this.options.forEach(op => {
            op.filter = new Filter(op.filter);
        });
        if (this.selected) {
            this.selected = filter.selected.map(op => new Filter(op));
        }
    }

    doFilter(items: any[]): any[] {
        let result = items;
        this.selected.forEach(filter => {
            if (filter.isActive && filter.selected) {
                result = filter.doFilter(result);
            }
        });
        return result;
    }
}

export class FilterGroup extends Entity {
    @ValidateNested({ each: true })
    filters: Filter[];
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    format?: string;

    set isActive(value) {
        this.filters.filter(f => f.selected).forEach(f => (f.isActive = value));
    }
    get isActive() {
        return this.filters.some(f => f.isActive && f.selected);
    }

    get OnlyFilterWithSelected() {
        return this.filters.filter(f => f.selected && f.show);
    }

    get filtersToShow() {
        return this.filters.filter(f => f.show);
    }
    constructor(filterGroup: Partial<FilterGroup>) {
        super(filterGroup);
        this.filters = filterGroup.filters.map(filter => new Filter(filter));
    }
}

export class UserFilter extends Entity {
    @ValidateNested({ each: true })
    filterGroups: FilterGroup[];

    @IsOptional()
    @IsBoolean()
    isDefualt?: boolean;

    constructor(props: Partial<UserFilter>) {
        super(props);
        this.filterGroups = props.filterGroups.map(g => new FilterGroup(g));
    }
}
