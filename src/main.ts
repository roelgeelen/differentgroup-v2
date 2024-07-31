import {AppComponent} from './app/app.component';
import {provideAnimations} from '@angular/platform-browser/animations';
import {APP_ROUTES} from './app/app-routing.module';
import { bootstrapApplication} from '@angular/platform-browser';
import {withInterceptorsFromDi, provideHttpClient, withInterceptors, HTTP_INTERCEPTORS} from '@angular/common/http';
import { environment as env } from './environments/environment';
import {PreloadAllModules, provideRouter, withPreloading} from "@angular/router";
import {ErrorInterceptor} from "./app/_helpers/interceptors/error.interceptor";
import {authHttpInterceptorFn, provideAuth0} from "@auth0/auth0-angular";


bootstrapApplication(AppComponent, {
  providers: [
    // importProvidersFrom(OAuthModule.forRoot({
    //   resourceServer: {
    //     allowedUrls: [environment.apiUrl, environment.apiUrlV2],
    //     sendAccessToken: true
    //   }
    // })),
    provideAuth0({
      ...env.auth,
      httpInterceptor: {
        ...env.httpInterceptor,
      },
    }),
    provideHttpClient(withInterceptorsFromDi(), withInterceptors([ErrorInterceptor, authHttpInterceptorFn])),
    provideAnimations(),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
  ]
})
  .catch(err => console.error(err));
