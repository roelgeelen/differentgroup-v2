import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from "./authentication.service";
import {Title} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private titleService: Title
  ) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.titleService.setTitle(route.title??"Different Group");
    const currentUser = this.authService.currentUserValue;
    if (currentUser && this.authService.hasValidAccessToken()) {
      // check if route is restricted by role
      //@ts-ignore
      if (route.data.roles && currentUser.roles.filter(role => route.data.roles.includes(role)).length === 0) {
        //@ts-ignore
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }
      // authorised so return true
      return true;
    }
    localStorage.setItem('returnUrl', state.url);
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/']);
    return false;
  }

}
