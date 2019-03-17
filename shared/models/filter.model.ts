import { Poly, Entity } from './Entity';
import { ValidateNested, IsOptional, IsBoolean, IsString } from 'class-validator';
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
