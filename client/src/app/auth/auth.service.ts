import { AuthController } from 'src/api/auth.controller';
import { Injectable } from '@angular/core';
import { APIService } from '../../api/http.service';

@Injectable()
export class AuthService extends AuthController {
    async logout(): Promise<{ status: number }> {
        const result = await super.logout();
        window.location.reload();
        return result;
    }
}
