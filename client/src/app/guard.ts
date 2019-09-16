import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { App } from 'shared/models';

@Injectable()
export class Guard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
    async canActivate(route: ActivatedRouteSnapshot) {
        const user = await this.authService.getUserAuthenticated();
        const hasPerm = user && user.hasPermission(route.data.app);
        if (!hasPerm) {
            this.router.navigate(['/login/' + App[route.data.app], {}]);
        }
        return true;
    }
}
