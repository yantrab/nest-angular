import { Length, IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';
import { Entity } from './Entity';

export enum Role {
    Admin,
    app1,
    app2,
    Macro,
}

export class User extends Entity {
    @IsOptional()
    @IsString()
    fName?: string;
    @IsOptional()
    @IsString()
    lName?: string;
    @IsEnum(Role, { each: true })
    roles: Role[];
    get FullName() { return this.fName + ' ' + this.lName; }
}

export class AddUserDTO extends User {
    @IsString()
    @IsEmail()
    // tslint:disable-next-line: variable-name
    _id: string;

    @IsString()
    @Length(5, 10)
    password: string;
}

export class LoginRequest {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @Length(5, 10)
    password: string;
    constructor(login?: Partial<LoginRequest>) {
        Object.assign(this, login);
    }
}

// export class o {
//     email: string;
//     num: number;
// }

// enum Color { Red, Green, Blue }
// export class LoginRequest {
//     email: string;
//     num: number;
//     numArray:number[];
//     color: Color;
//     bool: boolean;
//     data: Date;
//     obj:o;
//     objArr:o[]
//     optional?:string;
// }
