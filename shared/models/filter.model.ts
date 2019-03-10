import { Poly, Entity } from './Entity'
import { ValidateNested, IsOptional, IsBoolean, IsString } from 'class-validator';
export abstract class Filter extends Poly {
    @ValidateNested({ each: true })
    options: Entity[];
    @IsOptional()
    @IsBoolean()
    isMultiple?: boolean;
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
    selected?: Entity[] | Entity;
    @IsOptional()
    @IsString()
    placeholder?: string;
    constructor(filter?: Partial<Filter>) {
        super();
        if (filter) {
            Object.assign(this, filter)
        }
    }
}

export class CheckboxFilter extends Filter { }
export class DropdownFilter extends Filter { }
