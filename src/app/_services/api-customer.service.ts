import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ICustomer} from "../_models/customer.interface";

@Injectable({
  providedIn: 'root'
})
export class ApiFormService {

  constructor(private http: HttpClient) {
  }

  findCustomer(id: string) {
    return this.http.get<ICustomer>(`${environment.apiUrl}/v2/customer/${id}`);
  }
}
