import { Entity } from './Entity';

export class ContactFeild {
    property:string
    title:string
    length:number
    value:string
}

export class Contact extends Entity {
    startIndex: number;
    feilds:ContactFeild[]
}

export class Panel extends Entity {
    type: string;
    version: number;
    contacts: Contact[];
    settings;
    userId: string;
    address;
    constructor(data: Partial<Panel>) {
        super(data);
        this.contacts = data.contacts.map((c => new Contact(c)));
    }
}


export class PanelStructore extends Entity {

}

export class InitialData {
    panels: Panel[];
}
