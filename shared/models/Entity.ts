import { IsString, IsOptional } from 'class-validator';

export abstract class Entity {
    @IsString()
    // tslint:disable-next-line: variable-name
    _id: string;
    @IsOptional()
    @IsString()
    name?: string;
}

// tslint:disable-next-line: max-classes-per-file
export abstract class Poly extends Entity {
    @IsOptional()
    @IsString()
    kind?: string;
    constructor() {
        super();
        if (Object.getPrototypeOf(Object.getPrototypeOf(this)) === Poly.prototype) {
            throw new Error('Poly subclasses cannot be instantiated, they must be abstract');
        }
        this.kind = this.constructor.name;
    }
}
