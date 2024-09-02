import {Injectable} from '@angular/core';
import {BehaviorSubject, lastValueFrom, Observable} from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import {Router} from "@angular/router";
import {AuthService} from "@auth0/auth0-angular";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private permissionsSubject$: BehaviorSubject<string[]|null>;
  public permissions$: Observable<string[]|null>;

  constructor(private auth: AuthService, private router: Router) {
    this.permissionsSubject$ = new BehaviorSubject<string[]|null>([]);
    this.permissions$ = this.permissionsSubject$.asObservable();
  }

  async login() {
    this.permissionsSubject$.next(await this.convertTokenToUser());
    const returnUrl = localStorage.getItem('returnUrl');
    localStorage.clear();
    if (returnUrl) {
      this.router.navigate([returnUrl]);
    }
  }

  public get currentUserPermissions(): string[]|null {
    return this.permissionsSubject$.value;
  }

  async convertTokenToUser(): Promise<string[] | null> {
    const token = await lastValueFrom(this.auth.getAccessTokenSilently());
    if (token) {
      try {
        const decodedToken = jwtDecode<{permissions:string[]}>(token);
        return decodedToken.permissions || [];
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

}
