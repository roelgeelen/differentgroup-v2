import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";
import {DomSanitizer} from "@angular/platform-browser";
import {User} from "../../../_auth/models/User";
import {AuthenticationService} from "../../../_auth/authentication.service";
import {ApiService} from "../../../_services/api.service";
import {MatToolbarModule} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {Route, RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {LocalStorageService} from "../../../_services/local-storage.service";
import {ITheme, ThemeService} from "../../theme.service";
import {StyleManager} from "../../style-manager";
import {MatTree} from "@angular/material/tree";
import {NAV_CONFIG, NavItem} from "./nav-data";

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
    MatTree
  ],
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() toggleMenu = new EventEmitter<void>();
  currentUser: User | undefined;
  profilePic: Blob | null | undefined;
  themes: ITheme[];
  selectedTheme: ITheme;

  routes: NavItem[] = NAV_CONFIG;

  constructor(
    private oauthService: OAuthService,
    private authService: AuthenticationService,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
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
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user!;
      this.loadProfile();
    });
  }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(t => this.selectedTheme = t);
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


  loadProfile() {
    this.apiService.getProfilePicture().subscribe(pic => {
      if (pic.body?.size !== 0) {
        this.profilePic = pic.body;
        // @ts-ignore
        this.currentUser.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.profilePic))
      }
    })
  }

  public logout() {
    this.oauthService.logOut();
  }

    protected readonly JSON = JSON;
}
