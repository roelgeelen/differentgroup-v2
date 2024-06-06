import {Component, OnInit} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {AuthenticationService} from './_auth/authentication.service';
import {authConfig} from './_auth/auth.config';
import {User} from './_auth/models/User';
import {NAV_CONFIG, NavItem} from "./_helpers/components/navbar/nav-data";
import {FlatTreeControl} from "@angular/cdk/tree";
import {
  MatTreeFlatDataSource,
  MatTreeFlattener, MatTreeModule
} from "@angular/material/tree";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {NavbarComponent} from './_helpers/components/navbar/navbar.component';

interface FlatNode extends NavItem {
  expandable: boolean;
  // name: string;
  // icon: string;
  // url: string;
  level: number;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    NavbarComponent,
    MatSidenavModule,
    MatListModule,
    MatTreeModule,
    MatMenuModule,
    RouterModule,
    MatIconModule
  ]
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;
  private _transformer = (node: NavItem, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      title: node.title,
      icon: node.icon,
      path: node.path,
      roles: node.roles,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  hasChild = (_: number, node: FlatNode) => node.expandable;

  constructor(
    private oauthService: OAuthService,
    private authService: AuthenticationService
  ) {
    this.dataSource.data = NAV_CONFIG;
  }

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
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  get isUserLoggedIn() {
    return !!this.currentUser;
  }

  public logout() {
    this.oauthService.logOut();
  }

  hasPermission(roles: string[]): boolean {
    if (this.currentUser == undefined) {
      return false;
    }
    if (roles.length === 0) {
      return true;
    }
    return this.currentUser.roles.filter(role => roles.includes(role)).length !== 0;
  }
}
