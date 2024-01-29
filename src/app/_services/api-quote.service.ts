import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiQuoteService {

  constructor(private http: HttpClient) {
  }

  getProduct(id: string) {
    return this.http.get<any>(`${environment.apiLocal}/v2/quote/products/${id}`);
  }

  createInvoice(dealId: string, configId: string, replace: boolean, values: string[]) {
    return this.http.put(`${environment.apiUrl}/configs/${dealId}/forms/${configId}/invoice?replace=${replace}`, values);
  }
}
