import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {IForm} from "../_components/dynamic-form-builder/models/form.interface";

@Injectable({
  providedIn: 'root'
})
export class ApiFormService {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  getForms() {
    return this.http.get<IForm[]>(`${environment.apiUrl}/v2/forms`);
  }

  getForm(id: string) {
    return this.http.get<IForm>(`${environment.apiUrl}/v2/forms/${id}`);
  }
  createForm(form: IForm) {
    return this.http.post<IForm>(`${environment.apiUrl}/v2/forms`, form);
  }

}
