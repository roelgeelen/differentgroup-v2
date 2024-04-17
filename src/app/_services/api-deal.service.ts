import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {IForm} from "../_components/dynamic-form-builder/models/form.interface";
import {
  IFormAttachment
} from "../_components/dynamic-form-builder/form-controls/form-control-options.interface";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiFormService {

  constructor(private http: HttpClient) {
  }

  getForms(published = true) {
    return this.http.get<IForm[]>(`${environment.apiLocal}/v2/forms?published=${published}`);
  }

  getForm(id: string) {
    return this.http.get<IForm>(`${environment.apiLocal}/v2/forms/${id}`);
  }
  saveForm(form: IForm) {
    return this.http.post<IForm>(`${environment.apiLocal}/v2/forms`, form);
  }
  deleteForm(id: string) {
    return this.http.delete(`${environment.apiLocal}/v2/forms/${id}`);
  }

  upload(id:string, field: string, file: File){
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post<IFormAttachment>(`${environment.apiLocal}/v2/forms/${id}/fields/${field}/attachments`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  removeFormAttachment(id: string, attachment: string) {
    return this.http.delete(`${environment.apiLocal}/v2/forms/${id}/attachments/${attachment}`, {reportProgress:true, observe: 'events'});
  }
}
