/* tslint:disable:variable-name */
import { IsString, IsOptional } from 'class-validator';

export abstract class Entity {
    // tslint:disable-next-line: variable-name
    // tslint:disable-next-line: no-property-without-decorator
    @IsOptional()
    _id?: any;
    @IsOptional()
    @IsString()
    name?: string;

    get id() {
        return this._id ? this._id.toString() : undefined;
    }
    get isNew() {
        return !this.id;
    }
    constructor(data?) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
