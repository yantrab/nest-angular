import { Entity } from './Entity';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

export class ContactField {
    @IsString()
    property: string;
    @IsString()
    title: string;
    @IsNumber()
    length: number;
    @IsString()
    value?: string;
}

export class Contact {
    @IsNumber()
    id: number;
    @IsNumber()
    startIndex: number;
    @ValidateNested({ each: true })
    fields: ContactField[];
}

export class Panel extends Entity {
    @IsString()
    type: string;
    @IsNumber()
    version: number;
    @ValidateNested({ each: true })
    contacts: Contact[];
    settings;
    @IsString()
    userId: string;
    address;
}

export class PanelStructore extends Entity {}

export class InitialData {
    @ValidateNested({ each: true })
    panels: Panel[];
}
