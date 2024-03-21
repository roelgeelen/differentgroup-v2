import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {
  IQuoteLine,
  IQuoteLineProduct
} from "../_components/dynamic-form-builder/form-controls/form-control-options.interface";

@Injectable({
  providedIn: 'root'
})
export class ApiQuoteService {

  constructor(private http: HttpClient) {
  }

  searchProducts(skus: string[]) {
    return this.http.post<{results:IQuoteLineProduct[]}>(`${environment.apiLocal}/v2/quote/search/products`, skus);
  }
}
