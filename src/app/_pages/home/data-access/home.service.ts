import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {IPost} from "../utils/post.interface";
import {IPage} from "../../../_models/page.interface";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) {
  }

  getPosts(page: number, size: number, unPublished: boolean = false): Observable<IPage<IPost[]>> {
    return this.http.get<any>(`${environment.apiUrl}/posts?page=${page}&size=${size}&unPublished=${unPublished}`)
  }

  getPicture(uuid: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${environment.apiUrl}/images/${uuid}`, {observe: 'response', responseType: 'blob'});
  }

  getEvents() {
    return this.http.get<any>(`${environment.apiUrl}/profile/events?size=8`);
  }

  betrayUser(user: string, email: string) {
    return this.http.post(`https://prod-179.westeurope.logic.azure.com:443/workflows/a2639d37c50c44ab8f44958a676ee4ec/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=cPoNFZZAMPZ5jB_3oF1jd7t4YcekIQ2Nlai76UL8aJU`, {
      user,
      email
    });
  }
}
