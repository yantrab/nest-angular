import { Poly, Entity } from './Entity';
import { get, uniqBy } from 'lodash';
import { IsOptional, IsBoolean, IsString, ValidateNested, IsArray } from 'class-validator';
import * as Filters from './filter.model';
import { getDistribution } from '../utils';

export abstract class Filter extends Poly {
    @IsArray()
    options: any[];

    @IsOptional() selected?: any;

    @IsOptional() @IsString() optionNamePath?: string;
    @IsOptional() @IsString() optionIdPath?: string;

    @IsBoolean()
    @IsOptional()
    isMultiple?: boolean;
    @IsOptional() @IsBoolean() isActive?: boolean;
    @IsOptional()
    @IsString()
    placeholder?: string;
    constructor(filter?: Partial<Filter>) {
        super(filter);
    }
    doFilter(items: any[]): any[] {
        return items;
        // throw new Error('not implemented');
    }
    createOptions(items) {
        this.options = uniqBy(
            items.map(item => ({
                _id: get(item, this.optionIdPath),
                name: get(item, this.optionNamePath),
            })),
            '_id',
        );
    }
}

export class CheckboxFilter extends Filter {
    doFilter(items: any[]): any[] {
        return items;
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
        this.options = getDistribution(items.map(item => get(item, this.optionIdPath)));
    }
}
export class AutocompleteFilter extends Filter {
    doFilter(items: any[]): any[] {
        const ids = this.isMultiple ? this.selected.map(s => s._id) : [this.selected._id];
        return items.filter(item => ids.includes(get(item, this.optionIdPath)));
    }
}

export class SpecialFilter extends Filter {
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
    set isActive(value) {
        this.filters.filter(f => f.selected).forEach(f => (f.isActive = value));
    }
    get isActive() {
        return this.filters.some(f => f.isActive);
    }
    constructor(filterGroup: Partial<FilterGroup>) {
        super(filterGroup);
        this.filters = filterGroup.filters.map(filter => {
            const f: Filter = new Filters[filter.kind](filter);
            if (f.kind === 'SpecialFilter') {
                f.options.forEach(op => {
                    op.filter = new Filters[op.filter.kind](op.filter);
                });
            }
            return f;
        });
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
