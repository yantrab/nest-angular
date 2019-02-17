
import {Length, IsEmail} from "class-validator";

export class LoginRequest {
    
    @IsEmail()
    email: string

    @Length(6,10)
    password: string
}
export enum Role{
    Admin,
    app1,
}

export class User {
    fName: string;
    lName: string;
    roles:Role[];
    get FullName() { return this.fName + ' ' + this.lName }
}

