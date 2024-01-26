import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ICustomer, IRecentCustomer} from "../_models/configuration/customer.interface";
import {IConfiguration} from "../_models/configuration/configuration.interface";
import {IFormAttachment} from "../_components/dynamic-form-builder/form-controls/form-control-options.interface";
import {IPage} from "../_models/page.interface";
import {IConfigChanges} from "../_models/configuration/configuration-change.interface";

@Injectable({
  providedIn: 'root'
})
export class ApiCustomerService {

  constructor(private http: HttpClient) {
  }
  findRecentCustomers(name:string,page: number) {
    return this.http.get<IPage<IRecentCustomer[]>>(`${environment.apiLocal}/v2/customer?username=${name}&size=5&page=${page}`);
  }

  findCustomer(id: string) {
    return this.http.get<ICustomer>(`${environment.apiLocal}/v2/customer/${id}`);
  }

  getConfigurations(id: string) {
    return this.http.get<IConfiguration[]>(`${environment.apiLocal}/v2/customer/${id}/configurations`);
  }

  createConfiguration(id: string, config: IConfiguration) {
    return this.http.post<IConfiguration>(`${environment.apiLocal}/v2/customer/${id}/configurations`, config);
  }

  getConfiguration(id: string, configId: string) {
    return this.http.get<IConfiguration>(`${environment.apiLocal}/v2/customer/${id}/configurations/${configId}`);
  }

  updateConfiguration(id: string, configId: string, config: IConfiguration) {
    return this.http.put(`${environment.apiLocal}/v2/customer/${id}/configurations/${configId}`, config);
  }

  upload(id:string, configId: string, field: string, file: File){
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post<IFormAttachment>(`${environment.apiLocal}/v2/customer/${id}/configurations/${configId}/fields/${field}/attachments`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteConfiguration(id: string, configId: string) {
    return this.http.delete(`${environment.apiLocal}/v2/customer/${id}/configurations/${configId}`);
  }
}
