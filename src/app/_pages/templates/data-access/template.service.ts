import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {IForm} from "../../../_components/dynamic-form-builder/models/form.interface";
import {environment} from "../../../../environments/environment";
import {IFormAttachment} from "../../../_components/dynamic-form-builder/form-controls/form-control-options.interface";
import {IPage} from "../../../_models/page.interface";

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private http: HttpClient) {
  }

  getTemplates(name: string, page: number, size: number) {
    let params = new HttpParams();
    if (name !== undefined) {
      params = params.append('name', name);
    }
    params = params.append('size', size);
    params = params.append('page', page);
    return this.http.get<IPage<IForm[]>>(`${environment.apiUrlV2}/v2/forms?published=false`, {params});
  }

  getTemplate(id: string) {
    return this.http.get<IForm>(`${environment.apiUrlV2}/v2/forms/${id}`);
  }
  saveTemplate(form: IForm) {
    return this.http.post<IForm>(`${environment.apiUrlV2}/v2/forms`, form);
  }
  deleteTemplate(id: string) {
    return this.http.delete(`${environment.apiUrlV2}/v2/forms/${id}`);
  }

  upload(id:string, field: string, file: File){
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post<IFormAttachment>(`${environment.apiUrlV2}/v2/forms/${id}/fields/${field}/attachments`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  removeFormAttachment(id: string, attachment: string) {
    return this.http.delete(`${environment.apiUrlV2}/v2/forms/${id}/attachments/${attachment}`, {reportProgress:true, observe: 'events'});
  }

  getDealSchema() {
    return this.http.get<any>(`${environment.apiUrlV2}/v2/deals/schema`);
  }
}
