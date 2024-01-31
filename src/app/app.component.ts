import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthenticationService } from './_auth/authentication.service';
import { authConfig } from './_auth/auth.config';
import { User } from './_auth/models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private oauthService: OAuthService,
    private authService: AuthenticationService
  ) {}

  async ngOnInit() {
    this.configureOAuth();
    await this.handleAuthentication();
    this.setupSilentRefresh();
    this.subscribeToCurrentUser();
  }

  configureOAuth() {
    this.oauthService.configure(authConfig);
  }

  async handleAuthentication() {
    try {
      await this.oauthService.loadDiscoveryDocumentAndLogin();
      if (this.oauthService.hasValidIdToken()) {
        this.authService.login();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // Handle authentication errors gracefully
    }
  }

  setupSilentRefresh() {
    this.oauthService.setupAutomaticSilentRefresh();
  }

  subscribeToCurrentUser() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  get isUserLoggedIn() {
    return !!this.currentUser;
  }

  public logout() {
    this.oauthService.logOut();
  }
}
