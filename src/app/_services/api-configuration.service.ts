import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {IConfigChanges} from "../_models/configuration/configuration-change.interface";
import {IPage} from "../_models/page.interface";

@Injectable({
  providedIn: 'root'
})
export class ApiConfigurationService {

  constructor(private http: HttpClient) {
  }

  createConfigurationChange(id: string, change: IConfigChanges) {
    return this.http.post(`${environment.apiLocal}/v2/configuration/${id}/changes`, change);
  }
  getConfigurationChanges(id: string, page: number) {
    return this.http.get<IPage<IConfigChanges[]>>(`${environment.apiLocal}/v2/configuration/${id}/changes?size=5&page=${page}`);
  }
}
