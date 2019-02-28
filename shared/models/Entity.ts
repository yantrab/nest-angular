export abstract class Entity {
    _id: string;
    name?:string;
}

export abstract class Poly extends Entity {
    kind?: string;
    constructor() {
        super();
        if (Object.getPrototypeOf(Object.getPrototypeOf(this)) === Poly.prototype) {
            throw new Error("Poly subclasses cannot be instantiated, they must be abstract");
        }
        this.kind = this.constructor.name;
    }
}





