import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {IConfigChanges} from "../utils/configuration-change.interface";
import {IPage} from "../../../_models/page.interface";
import {IConfiguration} from "../utils/configuration.interface";
import {IForm} from "../../../_components/dynamic-form-builder/models/form.interface";
import {
  IQuoteLineProduct
} from "../../../_components/dynamic-form-builder/form-controls/form-control-options.interface";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private http: HttpClient) {
  }

  getTemplates() {
    return this.http.get<IPage<IForm[]>>(`${environment.apiUrlV2}/v2/forms?published=true`);
  }

  getConfigurationChanges(id: string, page: number) {
    return this.http.get<IPage<IConfigChanges[]>>(`${environment.apiUrlV2}/v2/configuration/${id}/changes?size=5&page=${page}`);
  }

  getConfigurations(id: string) {
    return this.http.get<IConfiguration[]>(`${environment.apiUrlV2}/v2/customer/${id}/configurations`);
  }

  createConfiguration(id: string, config: IConfiguration) {
    return this.http.post<IConfiguration>(`${environment.apiUrlV2}/v2/customer/${id}/configurations`, config);
  }

  getConfiguration(id: string, configId: string, type?: string) {
    return this.http.get<IConfiguration>(`${environment.apiUrlV2}/v2/customer/${id}/configurations/${configId}?type=${type}`);
  }

  updateConfiguration(id: string, configId: string, config: IConfiguration) {
    return this.http.put(`${environment.apiUrlV2}/v2/customer/${id}/configurations/${configId}`, config);
  }

  updateConfigAmount(id: string, configId: string, amount: number) {
    return this.http.put(`${environment.apiUrlV2}/v2/customer/${id}/configurations/${configId}/amount`, amount);
  }

  moveConfiguration(id: string, configId: string, customerId: string) {
    return this.http.put(`${environment.apiUrlV2}/v2/customer/${id}/configurations/${configId}/move`, customerId);
  }

  deleteConfiguration(id: string, configId: string) {
    return this.http.delete(`${environment.apiUrlV2}/v2/customer/${id}/configurations/${configId}`);
  }

  searchProducts(skus: string[]) {
    return this.http.post<{results:IQuoteLineProduct[]}>(`${environment.apiUrlV2}/v2/quote/search/products`, skus);
  }
}
