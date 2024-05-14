import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpParams, HttpRequest, HttpResponse} from "@angular/common/http";
import {IForm} from "../../../_components/dynamic-form-builder/models/form.interface";
import {environment} from "../../../../environments/environment";
import {IFormAttachment} from "../../../_components/dynamic-form-builder/form-controls/form-control-options.interface";
import {IPage} from "../../../_models/page.interface";
import {INews} from "../utils/news";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) {
  }

  getNewsList(page: number, size: number) {
    return this.http.get<IPage<INews[]>>(`${environment.apiUrl}/posts?page=${page}&size=${size}&unPublished=true`)
  }

  getNews(uuid: string | null) {
    return this.http.get<INews>(`${environment.apiUrl}/posts/${uuid}`);
  }

  getPicture(uuid: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${environment.apiUrl}/images/${uuid}`, {observe: 'response', responseType: 'blob'});
  }

  createNews(post: INews, file: File): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('title', post.title);
    formdata.append('content', post.message);
    // @ts-ignore
    formdata.append('published', post.published);
    const req = new HttpRequest('POST', `${environment.apiUrl}/posts`, formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  updateNews(post: INews, file?: File) {
    const formdata: FormData = new FormData();
    if (file)
      formdata.append('file', file);
    formdata.append('title', post.title);
    formdata.append('content', post.message);
    // @ts-ignore
    formdata.append('published', post.published);
    const req = new HttpRequest('PUT', `${environment.apiUrl}/posts/${post.id}`, formdata, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }
}
