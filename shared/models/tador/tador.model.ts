import { Entity } from './Entity';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class ContactField extends Entity {
    @IsString()
    property: string;
    @IsString()
    title: string;
    @IsNumber()
    length: number;
    defualt?: any = '';
}

export enum FieldType {
    text,
    list,
    yesNo,
    timer,
}
export class SettingField extends Entity {
    @IsNumber()
    length: number;

    @IsNumber()
    index: number;
    @ValidateNested()
    type: FieldType;

    options?: Function;
    value: any;
    default?: any = '';

    constructor(props) {
        super(props);
        if (!this.value) {
            this.value = props.default;
        }
    }
}

export class Contacts extends Entity {
    @IsNumber()
    index: number;
    @ValidateNested({ each: true })
    contactFields: ContactField[];
    @IsNumber()
    count: number;
    list?: any[];
    constructor(contacts: Partial<Contacts>) {
        super(contacts);
        this.contactFields = this.contactFields.map(f => new ContactField(f));
        if (!this.list) {
            this.list = new Array(this.count).fill(1).map((_, i) => {
                return this.contactFields.reduce(
                    (item, field) => {
                        item[field.property] = field.defualt;
                        return item;
                    },
                    { id: i + 1 },
                );
            });
        }
    }
}

export class Panel extends Entity {
    @IsString()
    type: string;
    @IsNumber()
    version: number;
    @ValidateNested({ each: true })
    contacts: Contacts;
    @ValidateNested()
    settings: Array<{ name: string; fields: SettingField[] }>;
    @IsString()
    userId: string;
    address;
    constructor(panel: Partial<Panel>) {
        super(panel);
        this.contacts = new Contacts(panel.contacts);
    }
    dump() {}
}

export class PanelStructore extends Entity {}

export class InitialData {
    @ValidateNested({ each: true })
    panels: Panel[];
}
