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
    return this.http.get<any>(`${environment.apiUrl}/profile/events?size=6`);
  }
}
