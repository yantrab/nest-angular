import { LoginRequest, User } from 'shared'
import { plainToClass } from "class-transformer";
import { get, post } from "./http.service";

export class AuthController {
    
    async login(user: LoginRequest): Promise<User> {
        return new Promise((resolve) => post('rest/auth/login',user).then((data:any) => resolve(plainToClass(User,<User>data))))
    }

    
    async isAuthenticatd(): Promise<{ isAuthenticatd: boolean; }> {
        return new Promise((resolve) => get('rest/auth/isAuthenticatd').then((data:any) => resolve(data)))
    }

}
