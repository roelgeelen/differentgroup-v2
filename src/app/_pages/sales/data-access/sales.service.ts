import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {IMeasureTable} from "../utils/measureTable";

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http:HttpClient) { }

  getMeasure() {
    return this.http.get<IMeasureTable[]>(`${environment.apiUrl}/graphs/table/measure`)
  }
}
