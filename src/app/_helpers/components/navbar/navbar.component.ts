import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {AsyncPipe, NgIf} from "@angular/common";
import {Route, RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {LocalStorageService} from "../../../_services/local-storage.service";
import {ITheme, ThemeService} from "../../theme.service";
import {StyleManager} from "../../style-manager";
import {MatTree} from "@angular/material/tree";
import {NAV_CONFIG, NavItem} from "./nav-data";
import {AuthService} from "@auth0/auth0-angular";
import {AuthenticationService} from "../../../_auth/authentication.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [
    MatToolbarModule,
    NgIf,
    RouterLink,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTree,
    AsyncPipe
  ],
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() toggleMenu = new EventEmitter<void>();
  userPermissions: string[] = [];
  themes: ITheme[];
  selectedTheme: ITheme;

  routes: NavItem[] = NAV_CONFIG;

  constructor(
    // private oauthService: OAuthService,
    private authenticationService: AuthenticationService,
    protected auth:AuthService,
    public styleManager: StyleManager,
    private themeService: ThemeService,
    private localStorage: LocalStorageService,
  ) {
    this.themes = themeService.themes;

    const themeName = this.localStorage.getValue(LocalStorageService.themeKey);

    if (themeName) {
      this.selectedTheme = this.selectTheme(themeName);
    } else {
      this.selectedTheme = this.selectTheme(ThemeService.defaultTheme.name);
    }
    this.authenticationService.permissions$.subscribe(p => {
      this.userPermissions = p!;
    });
  }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(t => this.selectedTheme = t);
  }

  hasPermission(roles: string[]): boolean {
    if (roles.length === 0) {
      return true;
    }
    return this.userPermissions.filter(role => roles.includes(role)).length !== 0;
  }

  selectTheme(themeName: string): ITheme {
    const theme = this.themeService.findTheme(themeName);
    if (theme) {
      this.themeService.updateTheme(theme);
      this.styleManager.removeStyle('theme');
      this.styleManager.setStyle('theme', `${theme.name}.css`);
      this.localStorage.store(LocalStorageService.themeKey, theme.name);
      return theme;
    }
    return ThemeService.defaultTheme;
  }

  public logout() {
    this.auth.logout();
  }
}
