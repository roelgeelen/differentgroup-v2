import {Injectable} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {BehaviorSubject, Observable} from 'rxjs';
import {jwtDecode} from 'jwt-decode'; // Let op: 'jwt-decode' importeren als 'jwt_decode'
import {User} from './models/User';
import {Token} from './models/token';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private oauthService: OAuthService, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(): void {
    this.currentUserSubject.next(this.convertTokenToUser());
    const returnUrl = localStorage.getItem('returnUrl');
    localStorage.clear();
    if (returnUrl) {
      this.router.navigate([returnUrl]);
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
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

  hasValidAccessToken(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

}
