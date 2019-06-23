import { Entity } from '../Entity';
import { IsNumber, IsString, ValidateNested, IsEnum, IsOptional } from 'class-validator';

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
                    (item, field) => {
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
    @IsNumber()
    phoneNumber: number;
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

export class NPPanel extends Panel {
    constructor(panel: { name: string; address: string; userId: string }) {
        super({
            userId: panel.userId,
            maxEEprom: 62203,
            address: panel.address,
            name: panel.name,
            type: 'MP',
            version: 1.1,
            contacts: new Contacts({
                count: 250,
                contactFields: [
                    new ContactField({ property: 'Name', title: 'שם 1', index: 2551, length: 16 }),
                    new ContactField({ property: 'Tel1Num', title: 'טלפון 1', index: 36382, length: 15 }),
                    new ContactField({ property: 'Tel2Num', title: 'טלפון 2', index: 40132, length: 15 }),
                    new ContactField({ property: 'Tel3Num', title: 'טלפון 3', index: 43882, length: 15 }),
                    new ContactField({ property: 'Tel4Num', title: 'טלפון 4', index: 47632, length: 15 }),
                    new ContactField({ property: 'Tel5Num', title: 'טלפון 5', index: 51382, length: 15 }),
                    new ContactField({ property: 'Tel6Num', title: 'טלפון 6', index: 55132, length: 15 }),
                    new ContactField({ property: 'Code', title: 'קוד', index: 51, length: 10 }),
                    new ContactField({ property: 'OutPut', title: 'reff', index: 10551, length: 3 }),
                    new ContactField({ property: 'NewNo', title: 'apartment', index: 35631, length: 3 }),
                ],
            }),
            settings: [
                {
                    name: 'general',
                    fields: [
                        new SettingField({
                            type: FieldType.text,
                            name: 'MasterCode',
                            index: 35631,
                            length: 31,
                            value: '123456',
                        }),
                        new SettingField({
                            type: FieldType.text,
                            name: 'TecUserCode',
                            index: 41,
                            length: 10,
                            value: '252525',
                        }),
                        new SettingField({
                            type: FieldType.text,
                            name: 'ExtKeys',
                            index: 11337,
                            length: 2,
                            value: '00',
                        }),
                        new SettingField({
                            type: FieldType.text,
                            name: 'FASTstep',
                            index: 35553,
                            length: 1,
                            value: '1',
                        }),
                        new SettingField({
                            type: FieldType.text,
                            name: 'Ofset',
                            index: 35627,
                            length: 4,
                            value: '0000',
                        }),
                        new SettingField({
                            type: FieldType.text,
                            name: 'CommSpd',
                            index: 36381,
                            length: 1,
                            value: '2',
                        }),
                        new SettingField({
                            type: FieldType.text,
                            name: 'FamilyNo',
                            index: 58995,
                            length: 1,
                            value: '0',
                        }),
                        new SettingField({
                            options: () => new Array(250).fill(0).map((__, j) => j),
                            type: FieldType.list,
                            name: 'Relay1MeM',
                            index: 62201,
                            length: 1,
                            value: 250,
                        }),
                        new SettingField({
                            options: () => new Array(250).fill(0).map((__, j) => j),
                            type: FieldType.list,
                            name: 'Relay2MeM',
                            index: 62201,
                            length: 1,
                            value: 250,
                        }),
                    ],
                },
                {
                    name: 'TimeCycle',
                    index: 11301,
                    length: 2,
                    fields: [
                        'DelayT',
                        'DoorT',
                        'DelayT2',
                        'DoorT2',
                        'IlluminationT',
                        'RingT',
                        'CameraT',
                        'ProxyT',
                        'FDooR',
                        'DetAnN',
                        'NameAnN',
                        'FloorAnN',
                        'NameLisT',
                        'SelNamE',
                        'SelCleaR',
                        'SpeachT',
                        'BussyRinG',
                        'ConfirM',
                    ].map(
                        name =>
                            new SettingField({
                                type: FieldType.list,
                                name,
                                value: '00',
                                options: () =>
                                    Array.from(Array(100).keys()).map(a => {
                                        return ('0' + a.toString()).slice(-2);
                                    }),
                            }),
                    ),
                },
                {
                    name: 'AnswerY_N',
                    length: 1,
                    index: 35347,
                    fields: [
                        'ApartmentS',
                        'DetectorBL',
                        'Proxy1R1',
                        'Proxy1R2',
                        'Proxy2R1',
                        'Proxy2R2',
                        'ProxyNpiN',
                        'AtoZ',
                        'ExternalPxY',
                        'ElevetorCnT',
                        'UsingRTC',
                        'DispTelVaL',
                        'BuzOnRlZ',
                        'NoApNoOf',
                        'DirectDial',
                        'FullMenu',
                    ].map(
                        name =>
                            new SettingField({
                                type: FieldType.yesNo,
                                name,
                            }),
                    ),
                },
                {
                    name: 'BusySogTone',
                    index: 58884,
                    length: 2,
                    fields: [
                        'BusyTone1',
                        'BusyTone2',
                        'BusyLvL',
                        'BusyFreQ',
                        'LowRingFreq',
                        'HighRingFreq',
                        'BreakBtweenRingS',
                        'RingsToMovE',
                        'BussyBeforeHanG',
                    ].map(
                        name =>
                            new SettingField({
                                type: FieldType.list,
                                options: () =>
                                    Array.from(Array(100).keys()).map(a => {
                                        return ('0' + a.toString()).slice(-2);
                                    }),
                                name,
                            }),
                    ),
                },
                {
                    name: 'rings',
                    fields: [
                        new SettingField({
                            type: FieldType.list,
                            options: () => Array.from(Array(7).keys()).map(n => n.toString()),
                            name: 'SpeechLevel',
                            index: 35554,
                            length: 1,
                            value: '7',
                        }),
                        new SettingField({
                            type: FieldType.list,
                            options: () => Array.from(Array(100).keys()).map(n => n.toString()),
                            name: 'RingingNum',
                            index: 58882,
                            length: 2,
                            value: '02',
                        }),
                        new SettingField({
                            type: FieldType.list,
                            options: () => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'],
                            name: 'toneCode 1',
                            index: 58902,
                            length: 1,
                        }),
                        new SettingField({
                            type: FieldType.list,
                            options: () => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-'],
                            name: 'toneCode 2',
                            index: 58903,
                            length: 1,
                        }),
                        new SettingField({
                            type: FieldType.list,
                            options: () => ['0', '1', '2', '3', '4', '5', '6', '7', '-'],
                            name: 'ConfirmTone',
                            index: 58904,
                            length: 1,
                        }),
                    ],
                },
                {
                    name: 'FloorValue',
                    length: 3,
                    index: 35363,
                    fields: Array.from(Array(30).keys()).map(
                        j =>
                            new SettingField({
                                type: FieldType.list,
                                options: () => Array.from(Array(250).keys()).map(n => ('00' + n.toString()).slice(-3)),
                                name: 'floorValue' + j,
                            }),
                    ),
                },
                {
                    name: 'SetReadTimer',
                    length: 16,
                    index: 58910,
                    fields: ['dialer1', 'dialer2', 'relay1', 'relay2'].map(
                        name =>
                            new SettingField({
                                type: FieldType.timer,
                                name,
                                value: { day: '0000000', from: '12:00', to: '13:00' },
                            }),
                    ),
                },
            ],
        });
    }
}

export class InitialData {
    @ValidateNested({ each: true })
    panels: Panel[];
}
