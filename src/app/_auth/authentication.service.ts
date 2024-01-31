import {Injectable} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {BehaviorSubject, Observable} from 'rxjs';
import {jwtDecode} from 'jwt-decode'; // Let op: 'jwt-decode' importeren als 'jwt_decode'
import {User} from './models/User';
import {Token} from './models/token';
import {HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(private oauthService: OAuthService) {
    this._currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser$ = this._currentUserSubject.asObservable();
  }

  login(): void {
    this._currentUserSubject.next(this.convertTokenToUser());
    const returnUrl = localStorage.getItem('returnUrl');
    localStorage.clear();
    if (returnUrl) {
      this.oauthService.initImplicitFlow(`state=${returnUrl}`);
    }
  }

  public get currentUserValue(): User | null {
    return this._currentUserSubject.value;
  }

  convertTokenToUser(): User | null {
    const token = this.oauthService.getAccessToken();
    console.log(token)
    if (token) {
      try {
        const decodedToken = jwtDecode<Token>(token);
        return {
          id: decodedToken.oid || '',
          image: undefined,
          name: decodedToken.name?.split(' | ')[0] || '',
          email: decodedToken.preferred_username || '',
          roles: decodedToken.roles || []
          // Add other custom claims as needed
        };
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  isTokenExpired(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

}
