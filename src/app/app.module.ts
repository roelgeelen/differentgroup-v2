import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {OAuthModule} from "angular-oauth2-oidc";
import {environment} from "../environments/environment";
import {HttpClientModule} from "@angular/common/http";
import {MatToolbarModule} from "@angular/material/toolbar";
import {NavbarComponent} from "./_helpers/components/navbar/navbar.component";
import {SharedModule} from "./shared.module";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatSidenavContainer, MatSidenavModule} from "@angular/material/sidenav";
import {MatTreeModule} from "@angular/material/tree";
import {MatMenuItem} from "@angular/material/menu";
import {MatListModule} from "@angular/material/list";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [environment.apiUrl, environment.apiUrlV2],
        sendAccessToken: true
      }
    }),
    SharedModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    NavbarComponent,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatTreeModule,
    MatMenuItem,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
