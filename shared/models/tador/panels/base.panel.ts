import { Entity } from '../../Entity';
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
export class ContactField extends Entity {
    @IsString()
    property: string;
    @IsString()
    title: string;
    @IsNumber()
    index: number;
    @IsNumber()
    length: number;
}

export enum FieldType {
    text,
    list,
    yesNo,
    timer,
}
export class SettingField extends Entity {
    @IsOptional()
    @IsNumber()
    length?: number;

    @IsOptional()
    @IsNumber()
    index?: number;

    @IsEnum(FieldType)
    type: FieldType;

    @IsOptional()
    @ValidateNested()
    options?: Function;
    value: any;
    default?: any = '';

    constructor(props: Partial<SettingField>) {
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
                    item => {
                        // item[field.property] = field.defualt;
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
    phoneNumber: string;
    @IsNumber()
    maxEEprom: number;
    @IsString()
    type: string;
    @IsNumber()
    version: number;
    @ValidateNested({ each: true })
    contacts: Contacts;
    @ValidateNested()
    settings: Array<{ name: string; fields: SettingField[]; index?: number; length?: number }>;
    @IsString()
    userId: string;
    address;
    constructor(panel: Partial<Panel>) {
        super(panel);
        this.contacts = new Contacts(panel.contacts);
    }
    dump() {
        const arr = new Array(this.maxEEprom).fill(' ');
        this.contacts.contactFields.forEach(field => {
            const fieldLength = field.length;
            const index = field.index;
            const all = this.contacts.list
                .map(c => ((c[field.property] || '') + ' '.repeat(fieldLength)).slice(0, fieldLength))
                .join('');
            all.split('').forEach((c, i) => {
                arr[index + i] = c;
            });
        });

        this.settings.forEach(s => {
            s.fields.forEach((f, i) => {
                if (!f.value) return;
                const value: string =
                    f.type == FieldType.timer
                        ? f.value.day + f.value.from.replace(':', '') + f.value.to.replace(':', '')
                        : f.value.toString();

                const jInit = f.index || s.index + i * s.length;
                for (let j = 0; j < (f.length || s.length); j++) {
                    arr[jInit + j] = value[j] || '';
                }
            });
        });
        return arr.join('');
    }
}
