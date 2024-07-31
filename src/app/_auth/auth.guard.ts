import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {map, Observable} from 'rxjs';
import {AuthService} from "@auth0/auth0-angular";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService,
    private authService: AuthenticationService
  ) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.isAuthenticated$.pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          const userPermissions = this.authService.currentUserPermissions;
          if (route.data['roles'] && !route.data['roles'].some((role: string) => userPermissions!.includes(role))) {
            // Role not authorised, redirect to home page
            this.router.navigate(['/']);
            return false;
          }
          // Authorised, return true
          return true;
        }
        // Not logged in, redirect to login page with the return url
        localStorage.setItem('returnUrl', state.url);
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}
