import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  duration = 3000;

  constructor(private _snackBar: MatSnackBar) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].indexOf(err.status) !== -1) {
        this._snackBar.open('Authenticatie mislukt', 'OK', {duration: this.duration});
      }

      if ([500].indexOf(err.status) !== -1) {
        this._snackBar.open('Er is iets mis gegaan', 'OK', {duration: this.duration});
      }

      if (err.status <= 0 || [404].indexOf(err.status) !== -1) {
        this._snackBar.open('Kan server niet bereiken', 'OK', {duration: this.duration});
      }

      const error = err.error.message || err.error;
      return throwError(error);
    }));
  }
}
