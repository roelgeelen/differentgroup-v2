import {Component, OnInit, ViewChild} from '@angular/core';
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

  constructor(
    private oauthService: OAuthService,
    private authService: AuthenticationService,
    private apiService: ApiService,
    private sanitizer: DomSanitizer
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user!;
      this.loadProfile();
    });
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
  }

  public logout() {
    this.oauthService.logOut();
  }
}
