import { AuthController } from 'src/api/auth.controller';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService extends AuthController {
    async logout(): Promise<{ status: number }> {
        const result = await super.logout();
        window.location.reload();
        return result;
    }
}
