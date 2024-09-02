import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  constructor(private http:HttpClient) { }

  getStock() {
    return this.http.get<any>(`${environment.apiUrl}/stockroom`)
  }

  getChecklist(date: string | null, type: string) {
    return this.http.get<any>(`${environment.apiUrl}/stockroom/table/control?date=${date}&type=${type}`)
  }

  updatePick(id: string, status: boolean) {
    return this.http.put(`${environment.apiUrl}/stockroom/control/${id}/picked`, status)
  }
}
