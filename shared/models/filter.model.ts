import { Poly, Entity } from './Entity';
import { IsOptional, IsBoolean, IsString, ValidateNested } from 'class-validator';
export abstract class Filter extends Poly {
    options: any[];
    @IsOptional()
    @IsBoolean()
    isMultiple?: boolean;
    @IsOptional() @IsBoolean() isActive?: boolean;
    selected?: any;
    @IsOptional()
    @IsString()
    placeholder?: string;
    constructor(filter?: Partial<Filter>) {
        super(filter);
    }
}

export class CheckboxFilter extends Filter { }
export class DropdownFilter extends Filter { }
export class AutocompleteFilter extends Filter { }

export class FilterGroup extends Entity {
    @ValidateNested({ each: true })
    filters: Filter[];
    @IsString()
    name: string;
}

export class UserFilter extends Entity {
    @ValidateNested({ each: true })
    FilterGroup: Filter[];
    @IsString()
    name: string;
}
