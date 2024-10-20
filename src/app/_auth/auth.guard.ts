import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {isEmpty, map, Observable} from 'rxjs';
import {AuthService} from "@auth0/auth0-angular";
import {AuthenticationService} from "./authentication.service";
import {Title} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService,
    private authService: AuthenticationService,
    private titleService: Title
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.titleService.setTitle(route.title??"Different Group");
    return this.auth.isAuthenticated$.pipe(
      map(isAuthenticated => {
        const userPermissions = this.authService.currentUserPermissions || [];
        if (isAuthenticated && userPermissions.length >0) {
          if (route.data['roles'] && userPermissions) {
            const hasRequiredRole = route.data['roles'].some((role: string) => userPermissions.includes(role));
            if (!hasRequiredRole) {
              // Role not authorised, return UrlTree to redirect to home page
              return this.router.createUrlTree(['/']);
            }
          }
          // Authorised or no roles required, return true
          return true;
        }

        // Not logged in, redirect to login page with the return url
        localStorage.setItem('returnUrl', decodeURI(state.url));
        return this.router.createUrlTree(['/login']);
      })
    );
  }

}
