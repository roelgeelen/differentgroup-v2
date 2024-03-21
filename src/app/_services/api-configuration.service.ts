import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {IConfigChanges} from "../_models/configuration/configuration-change.interface";
import {IPage} from "../_models/page.interface";
import {IQuoteLine} from "../_components/dynamic-form-builder/form-controls/form-control-options.interface";

@Injectable({
  providedIn: 'root'
})
export class ApiConfigurationService {

  constructor(private http: HttpClient) {
  }

  createConfigurationChange(id: string, change: IConfigChanges) {
    return this.http.post(`${environment.apiLocal}/v2/configuration/${id}/changes`, change);
  }

  getConfigurationChanges(id: string, page: number) {
    return this.http.get<IPage<IConfigChanges[]>>(`${environment.apiLocal}/v2/configuration/${id}/changes?size=5&page=${page}`);
  }

  getDeal(id: string, properties: string[]) {
    return this.http.get<any>(`${environment.apiLocal}/v2/configuration/${id}/deal?properties=${properties.join(',')}`);
  }

  updateToDeal(id: string, change: any) {
    return this.http.put(`${environment.apiLocal}/v2/configuration/${id}/deal`, change);
  }

  createInvoice(id: string, replace: boolean, values: IQuoteLine[]) {
    return this.http.post(`${environment.apiLocal}/v2/configuration/${id}/invoice?replace=${replace}`, values);
  }
}
