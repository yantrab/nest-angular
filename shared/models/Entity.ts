export class Entity {
    _id: string;
    name?:string;
}

export class Poly extends Entity {
    kind?: string;
    constructor() {
        super();
        this.kind = this.constructor.name;
    }
}





