
import {Length, IsEmail} from "class-validator";

export class LoginRequest {
    
    @IsEmail()
    email: string

    @Length(6,10)
    password: string
}

export class User {
    fName: string;
    lName: string;

    get FullName() { return this.fName + ' ' + this.lName }
}