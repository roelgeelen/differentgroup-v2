import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  getProfilePicture(): Observable<HttpResponse<Blob>> {
    return this.http.get(`${environment.apiUrl}/profile/avatar`, {observe: 'response', responseType: 'blob'});
  }

  getTest(): Observable<any> {
    return this.http.get(`http://localhost:8080/test`);
  }

}
