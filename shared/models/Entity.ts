import { IsString, IsOptional } from 'class-validator';

export abstract class Entity {
    @IsString()
    // tslint:disable-next-line: variable-name
    _id: string;
    @IsOptional()
    @IsString()
    name?: string;

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
