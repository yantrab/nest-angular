import { Poly, Entity } from './Entity';
import { get, uniqBy } from 'lodash';
import { IsOptional, IsBoolean, IsString, ValidateNested } from 'class-validator';
import * as Filters from './filter.model';

export abstract class Filter extends Poly {
    options: any[];
    optionNamePath: string;
    optionIdPath: string;

    @IsBoolean()
    @IsOptional()
    isMultiple?: boolean;
    @IsOptional() @IsBoolean() isActive?: boolean;
    selected?: any;
    @IsOptional()
    @IsString()
    placeholder?: string;
    constructor(filter?: Partial<Filter>) {
        super(filter);
    }
    doFilter(items: any[]): any[] {
        throw new Error('not implemented');
    }
    createOptions(items) {
        this.options = uniqBy(items.map(item => ({
            _id: get(item, this.optionIdPath),
            name: get(item, this.optionNamePath),
        })), '_id');
    }
}

export class CheckboxFilter extends Filter {
    doFilter(items: any[]): any[] {
        throw new Error('not implemented');
    }
}
export class DropdownFilter extends Filter {
    doFilter(items: any[]): any[] {
        throw new Error('not implemented');
    }
}
export class AutocompleteFilter extends Filter {
    doFilter(items: any[]): any[] {
        if (!this.selected) {
            return items;
        }
        return items.filter(item => get(item, this.optionIdPath) === this.selected._id);
    }
}

export class FilterGroup extends Entity {
    @ValidateNested({ each: true })
    filters: Filter[];
    @IsString()
    name: string;
    constructor(filterGroup: Partial<FilterGroup>) {
        super(filterGroup);
        this.filters = filterGroup.filters.map(filter => new Filters[filter.kind](filter));
    }
}

export class UserFilter extends Entity {
    @ValidateNested({ each: true })
    filterGroups: FilterGroup[];

    @IsOptional()
    @IsBoolean()
    isDefualt?: boolean;

    constructor(props: UserFilter) {
        super(props);
        this.filterGroups = props.filterGroups.map(g => new FilterGroup(g));
    }
}
