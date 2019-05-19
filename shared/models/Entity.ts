/* tslint:disable:variable-name */
import { IsString, IsOptional, IsMongoId } from 'class-validator';
export abstract class Entity {
    // tslint:disable-next-line: variable-name
    // tslint:disable-next-line: no-property-without-decorator
    @IsOptional()
    @IsMongoId()
    _id?;
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

// tslint:disable-next-line: max-classes-per-file
export abstract class Poly extends Entity {
    @IsOptional()
    @IsString()
    kind?: string;
    constructor(data?) {
        super(data);
        if (Object.getPrototypeOf(Object.getPrototypeOf(this)) === Poly.prototype) {
            throw new Error('Poly subclasses cannot be instantiated, they must be abstract');
        }
        this.kind = this.constructor.name;
    }
}
