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
export class ApiDealService {

  constructor(private http: HttpClient) {
  }

  getDealSchema() {
    return this.http.get<any>(`${environment.apiLocal}/v2/deals/schema`);
  }
}
