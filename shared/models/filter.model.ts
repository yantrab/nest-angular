import { Entity } from './Entity';
import { get, uniqBy } from 'lodash';
import { IsOptional, IsBoolean, IsString, ValidateNested } from 'class-validator';
import * as Filters from './filter.model';
import { getDistribution } from '../utils';

export abstract class Filter {
    @IsOptional() @IsString() kind?: string;
    @IsOptional() options?: any[];
    @IsOptional() selected?: any;
    @IsOptional() @IsString() optionNamePath?: string;
    @IsOptional() @IsString() optionIdPath?: string;
    @IsBoolean() @IsOptional() isMultiple?: boolean;
    @IsOptional() @IsBoolean() isActive?: boolean;
    @IsOptional() @IsBoolean() show?: boolean = true;
    @IsOptional() @IsString() placeholder?: string;
    @IsString() @IsOptional() format?: string;
        @IsOptional()
    @IsBoolean() lastChange?: boolean;
    _options: any[];
    get isDisabled() {
        if (this.lastChange) {
            this.lastChange = false;
            return false;
        }
        return this._options && this._options.filter(o => !o.isDisabled).length < 2;
    }
    constructor(filter?: Partial<Filter>) {
        Object.assign(this, filter);
        this.kind = this.constructor.name;
    }

    doFilter(items: any[]): any[] {
        throw new Error('not implemented');
    }
    _getOptions(items: any[]): any[] {
        return (
            this.options ||
            uniqBy(
                items

                    .map(item => ({
                        _id: get(item, this.optionIdPath),
                        name: get(item, this.optionNamePath || this.optionIdPath),
                    }))
                    .filter(o => o._id != undefined),
                '_id',
            )
        );
    }
    get hasOptions() {
        return (this.options && this.options.length) || (this._options && this._options.length);
    }
    setOptions(all) {
        if (this.options) {
            return;
        }
        this._options = this._getOptions(all);
        this._options.forEach(option => (option.isDisabled = true));
    }

    disableOptions(items: any[]) {
        if (!this._options) {
            return;
        }
        this._options.forEach(option => (option.isDisabled = false));
        if (this.lastChange) {
            return;
        }
        const relevant = this._getOptions(items);
        this._options.forEach(option => (option.isDisabled = !relevant.some(r => r._id === option._id)));
        // const enabledOptions = this._options.filter(option => !option.isDisabled);
        // if (enabledOptions.length === 1) {
        //     this.selected = this.isMultiple ? [enabledOptions[0]] : enabledOptions[0];
        // }
    }
}

export class CheckboxFilter extends Filter {
    constructor(checkboxFilter: Partial<CheckboxFilter>) {
        super(checkboxFilter);
        this.isMultiple = true;
    }
    doFilter(items: any[]): any[] {
        return items.filter(item => this.selected.find(s => s._id === get(item, this.optionIdPath)));
    }

    _getOptions(items: any[]) {
        return (
            this.options ||
            uniqBy(
                items
                    .map(item => ({ _id: get(item, this.optionIdPath), name: get(item, this.optionIdPath) }))
                    .filter(o => o._id != undefined),
                '_id',
            )
        );
    }
}
export class ComboboxFilter extends Filter {
    doFilter(items: any[]): any[] {
        return items.filter(item => this.selected._id === get(item, this.optionIdPath));
    }

    _getOptions(items: any[]) {
        return (
            this.options ||
            uniqBy(
                items
                    .map(item => ({ _id: get(item, this.optionIdPath), name: get(item, this.optionIdPath) }))
                    .filter(o => o._id != undefined),
                '_id',
            )
        );
    }
}
export class DateRangeComboFilter extends Filter {
    doFilter(items: any[]): any[] {
        return items.filter(item => {
            const date = get(item, this.optionIdPath);
            return +new Date() - this.selected._id - date >= 0;
        });
    }
}
export class QuantityFilter extends Filter {
    doFilter(items: any[]): any[] {
        return items.filter(item => {
            const val = get(item, this.optionIdPath);
            return val >= this.selected[0] && val <= this.selected[1];
        });
    }

    _getOptions(items: any[]) {
        const result = getDistribution(items.map(item => get(item, this.optionIdPath)));
        if (!result[0].x) return [];
        return result;
    }
}
export class AutocompleteFilter extends Filter {
    doFilter(items: any[]): any[] {
        const ids = this.isMultiple ? this.selected.map(s => s._id) : [this.selected._id];
        return items.filter(item => ids.includes(get(item, this.optionIdPath)));
    }
}
export class DropdownFilter extends AutocompleteFilter {}
export class SpecialFilter extends Filter {
    constructor(filter: Partial<SpecialFilter>) {
        super(filter);
        this.options.forEach(op => {
            op.filter = new Filters[op.filter.kind](op.filter);
        });
        if (this.selected) {
            this.selected = filter.selected.map(op => new Filters[op.kind](op));
        }
    }

    setOptions(all) {
        this.options.forEach(option => option.filter.setOptions(all));
    }
    disableOptions(items: any[]) {
        this.options.forEach(option => option.filter.disableOptions(items));
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

export class SpecialFilterGrid extends Filter {
    constructor(filter: Partial<SpecialFilterGrid>) {
        super(filter);
        this.options.forEach(ops => {
            ops.filters = ops.filters.map(filter => new Filters[filter.kind](filter));
        });
    }

    setOptions(all) {
        this.options.forEach(ops => {
            ops.filters.forEach(filter => filter.setOptions(all));
        });
    }
    disableOptions(items: any[]) {
        this.options.forEach(option => option.filter.disableOptions(items));
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
        this.filters = filterGroup.filters.map(filter => {
            if (!Filters[filter.kind]) {
                return console.log(JSON.stringify(filterGroup));
            }
            return new Filters[filter.kind](filter);
        });
    }
}

export class GridGroupChild extends Entity {
    @IsString()
    name: string;
    @IsOptional()
    @IsBoolean()
    isActive: boolean;
}

export class GridGroup extends Entity {
    @ValidateNested({ each: true })
    children: Array<GridGroupChild>;
    @IsString()
    name: string;
    @IsOptional()
    @IsBoolean()
    isActive: boolean;
    constructor(group) {
        super(group);
        this.children = group.children.map(g => new GridGroupChild(g));
    }
}

export class UserFilter extends Entity {
    @ValidateNested({ each: true })
    filterGroups: FilterGroup[];

    @IsOptional()
    @ValidateNested({ each: true })
    gridGroups?: GridGroup[];

    @IsOptional()
    @IsBoolean()
    isDefualt?: boolean;

    constructor(props: Partial<UserFilter>) {
        super(props);
        this.filterGroups = props.filterGroups.map(g => new FilterGroup(g));
        if (props.gridGroups) this.gridGroups = props.gridGroups.map(g => new GridGroup(g));
    }
}
