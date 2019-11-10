import { IsBoolean, IsOptional, IsString } from 'class-validator';
import get = Reflect.get;
import { uniqBy } from 'lodash';

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
