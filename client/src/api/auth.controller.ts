import { LoginRequest, User } from 'shared';
import { plainToClass } from "class-transformer";
import { APIService } from "./http.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthController {
    
    
    async login(user: LoginRequest): Promise<User> {
        return new Promise((resolve) => this.api.post('rest/auth/login',user).subscribe((data:any) => resolve(plainToClass(User,<User>data))))
    }

    
    async getUserAuthenticated(): Promise<{ user: User }> {
        return new Promise((resolve) => this.api.get('rest/auth/getUserAuthenticated').subscribe((data:any) => resolve(data)))
    }

    constructor(private readonly api: APIService) {
    }
}
