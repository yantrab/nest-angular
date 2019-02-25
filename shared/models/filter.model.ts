import { Poly, Entity } from './Entity'
export abstract class Filter extends Poly {
    options: Entity[];
    isMultiple?: boolean;
    isActive?: boolean;
    selected?: Entity[] | Entity;
    placeholder?: string;
    constructor(filter:Partial<Filter>){
        super()
        Object.assign(this,filter)
    }
}

export class CheckboxFilter extends Filter{}
export class DropdownFilter extends Filter{}