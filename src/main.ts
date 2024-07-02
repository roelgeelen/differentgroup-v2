import {importProvidersFrom} from '@angular/core';
import {AppComponent} from './app/app.component';
import {provideAnimations} from '@angular/platform-browser/animations';
import {APP_ROUTES} from './app/app-routing.module';
import { bootstrapApplication} from '@angular/platform-browser';
import {withInterceptorsFromDi, provideHttpClient, withInterceptors, HTTP_INTERCEPTORS} from '@angular/common/http';
import {environment} from './environments/environment';
import {OAuthModule} from 'angular-oauth2-oidc';
import {PreloadAllModules, provideRouter, withPreloading} from "@angular/router";
import {ErrorInterceptor} from "./app/_helpers/interceptors/error.interceptor";


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [environment.apiUrl, environment.apiUrlV2],
        sendAccessToken: true
      }
    })),
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([ErrorInterceptor])),
    provideAnimations(),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
  ]
})
  .catch(err => console.error(err));
