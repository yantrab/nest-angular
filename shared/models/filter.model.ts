import { Poly } from './Entity'
export abstract class Filter extends Poly {
    options: any[];
    isMultiple?: boolean;
    isActive?: boolean;
    selected?: any;
}

export class SelectboxFilter extends Filter{}
export class AutocompleteFilter extends Filter{}
export class DropdownFilter extends Filter{}