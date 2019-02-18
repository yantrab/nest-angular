import { AuthController } from "src/api/auth.controller";
import { User, LoginRequest } from "shared";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthService {

    api = new AuthController();
    user: User;
    async getUserAuthenticated() {
        if (!this.user)
            this.user = (await this.api.getUserAuthenticated()).user;
        return this.user;
    }

    login(user: LoginRequest): Promise<User> {
        return this.api.login(user)
    }
}