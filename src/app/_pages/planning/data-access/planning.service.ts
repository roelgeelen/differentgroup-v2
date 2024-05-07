import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {IVehicle} from "../utils/vehicle.interface";

@Injectable({
  providedIn: 'root'
})
export class PlanningService {

  constructor(private http:HttpClient) { }

  getProduced() {
    return this.http.get<any>(`${environment.apiUrl}/graphs/produced`)
  }

  getProduction() {
    return this.http.get<string[][]>(`${environment.apiUrl}/graphs/production/v2`)
  }

  getOrders() {
    return this.http.get<any>(`${environment.apiUrl}/graphs/totals/orders`)
  }

  getProjects() {
    return this.http.get<any>(`${environment.apiUrl}/graphs/totals/projects`)
  }

  getSchedule() {
    return this.http.get<any>(`${environment.apiUrl}/graphs/totals/schedule`)
  }

  getUB() {
    return this.http.get<any>(`${environment.apiUrl}/graphs/totals/ub`)
  }

  getTracking(organisation: string) {
    return this.http.get<IVehicle[]>(`${environment.apiUrl}/tracking/vehicles?organisation=${organisation}`);
  }
}
