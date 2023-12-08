import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {IForm} from "../_components/dynamic-form-builder/models/form.interface";

@Injectable({
  providedIn: 'root'
})
export class ApiFormService {

  constructor(private http: HttpClient) {
  }

  getForms() {
    return this.http.get<IForm[]>(`${environment.apiUrl}/v2/forms`);
  }

  getForm(id: string) {
    return this.http.get<IForm>(`${environment.apiUrl}/v2/forms/${id}`);
  }
  saveForm(form: IForm) {
    return this.http.post<IForm>(`${environment.apiUrl}/v2/forms`, form);
  }
  deleteForm(id: string) {
    return this.http.delete(`${environment.apiUrl}/v2/forms/${id}`);
  }
}
