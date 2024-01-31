import {Component, HostBinding, OnInit, ViewChild} from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {User} from "../../../_auth/models/User";
import {AuthenticationService} from "../../../_auth/authentication.service";
import {ApiService} from "../../../_services/api.service";
import {MatToolbarModule} from "@angular/material/toolbar";
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {LocalStorageService} from "../../../_services/local-storage.service";
import {ITheme, ThemeService} from "../../theme.service";
import {StyleManager} from "../../style-manager";

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
    MatButtonModule
  ],
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: User | undefined;
  profilePic: Blob | null | undefined;
  themes: ITheme[];
  selectedTheme: ITheme;

  constructor(
    private oauthService: OAuthService,
    private authService: AuthenticationService,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    public styleManager: StyleManager,
    private themeService: ThemeService,
    private localStorage: LocalStorageService
  ) {
    this.themes = themeService.themes;

    const themeName = this.localStorage.getValue(LocalStorageService.themeKey);

    if (themeName) {
      this.selectedTheme = this.selectTheme(themeName);
    } else {
      this.selectedTheme = this.selectTheme(ThemeService.defaultTheme.name);
    }
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user!;
      this.loadProfile();
    });
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

  ngOnInit(): void {
    this.themeService.theme$.subscribe(t => this.selectedTheme = t);
  }

  public logout() {
    this.oauthService.logOut();
  }
}
