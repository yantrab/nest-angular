import {Length, IsEmail, IsNotEmpty} from "class-validator";
import { Entity } from "./Entity";

export enum Role{
    Admin,
    app1,
    app2,
}

export class User extends Entity{
    fName?: string;
    lName?: string;
    roles:Role[];
    get FullName() { return this.fName + ' ' + this.lName }
}

export class AddUserDTO extends User{
    @IsEmail()
    _id:string;

    @Length(5,10)
    password:string;
}

export class LoginRequest {
    @IsEmail()
    email: string

    @Length(5,10)
    password: string
}
