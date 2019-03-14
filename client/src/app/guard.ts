import { Injectable } from '@angular/core';
import {
    CanActivate,
ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from './auth/auth.service';
import { hasPermission } from 'shared';

@Injectable()
export class Guard implements CanActivate {
    constructor(private authService: AuthService) { }
    async canActivate(route: ActivatedRouteSnapshot) {
        const user = (await this.authService.getUserAuthenticated()).user;
        return hasPermission(user, route.data.roles);
    }
}
