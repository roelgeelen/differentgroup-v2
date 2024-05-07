import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {IConfigChanges} from "../utils/configuration-change.interface";
import {IPage} from "../../../_models/page.interface";
import {IQuoteLine} from "../../../_components/dynamic-form-builder/form-controls/form-control-options.interface";
import {ICustomer, IRecentCustomer} from "../utils/customer.interface";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) {
  }

  findRecentCustomers(options: { username?: string, name?: string, page: number, size: number }) {
    const {username, name, page, size} = options;
    let params = new HttpParams();
    if (username !== undefined) {
      params = params.append('username', username);
    }
    if (name !== undefined) {
      params = params.append('name', name);
    }
    params = params.append('size', size);
    params = params.append('page', page);

    return this.http.get<IPage<IRecentCustomer[]>>(`${environment.apiUrlV2}/v2/customer`, {params});
  }

  findCustomer(id: string) {
    return this.http.get<ICustomer>(`${environment.apiUrlV2}/v2/customer/${id}`);
  }

  getDeal(id: string, properties: string[]) {
    return this.http.get<any>(`${environment.apiUrlV2}/v2/configuration/${id}/deal?properties=${properties.join(',')}`);
  }

  updateToDeal(id: string, change: any) {
    return this.http.put(`${environment.apiUrlV2}/v2/configuration/${id}/deal`, change);
  }

  createInvoice(id: string, replace: boolean, values: IQuoteLine[]) {
    return this.http.post(`${environment.apiUrlV2}/v2/configuration/${id}/invoice?replace=${replace}`, values);
  }
}
