import { Entity } from './Entity';
export class Panel extends Entity {
    type: string;
    version: number;
    contacts: any[];
    settings;
    userId: string;
    address;
    constructor(data: Partial<Panel>) {
        super(data);
    }
}
export class ContactStructore extends Entity {
    startIndex: number;
}

export class PanelStructore extends Entity {

}

export class InitialData {
    panels: Panel[];
}
