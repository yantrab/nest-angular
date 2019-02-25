export class Entity {
    _id: string;
}

export class Poly extends Entity {
    kind: string;
    constructor() {
        super();
        this.kind = this.constructor.name;
    }
}





