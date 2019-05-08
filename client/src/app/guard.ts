import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { hasPermission } from 'shared';

@Injectable()
export class Guard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
    async canActivate(route: ActivatedRouteSnapshot) {
        const user = await this.authService.getUserAuthenticated();
        const hasPerm = hasPermission(user, route.data.app);
        if (!hasPerm) {
            this.router.navigate(['/login' + window.location.pathname, {}]);
        }
        return hasPerm;
    }
}
