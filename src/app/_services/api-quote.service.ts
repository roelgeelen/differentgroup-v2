import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiQuoteService {

  constructor(private http: HttpClient) {
  }

  findProducts(id: string[]) {
    return this.http.get<any>(`${environment.apiLocal}/v2/quote/products?ids=${id}`);
  }

  getProduct(id: string) {
    return this.http.get<any>(`${environment.apiLocal}/v2/quote/products/${id}`);
  }
}
