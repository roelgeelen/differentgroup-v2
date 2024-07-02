import {inject} from '@angular/core';
import {HttpInterceptorFn} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MatSnackBar} from "@angular/material/snack-bar";

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const duration = 3000; // Define your duration here or inject it similarly if needed

  return next(req).pipe(
    catchError((err: any) => {
      if ([401, 403].includes(err.status)) {
        snackBar.open('Authenticatie mislukt', 'OK', {duration});
      }

      if ([500].includes(err.status)) {
        snackBar.open('Er is iets mis gegaan', 'OK', {duration});
      }

      if (err.status <= 0 || [404].includes(err.status)) {
        snackBar.open('Kan server niet bereiken', 'OK', {duration});
      }

      const error = err.error.message || err.error;
      return throwError(() => error);
    })
  );
};
