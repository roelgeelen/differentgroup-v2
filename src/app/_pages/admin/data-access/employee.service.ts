import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {IPage} from "../../../_models/page.interface";
import {IUser} from "../utils/user";
import {IRole} from "../utils/role";
import {IConversation} from "../utils/conversation";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) {
  }

  getEmployees(page: number, size: number) {
    return this.http.get<IPage<IUser[]>>(`${environment.apiUrl}/employees?page=${page}&size=${size}`)
  }

  getEmployee(id: string) {
    return this.http.get<IUser>(`${environment.apiUrl}/employees/${id}`)
  }

  patchEmployeeManagers(id: string, managers: string[]) {
    return this.http.patch<IUser>(`${environment.apiUrl}/employees/${id}/managers`, managers)
  }
  patchEmployeePoints(id: string, points: number) {
    return this.http.patch<IUser>(`${environment.apiUrl}/employees/${id}/points`, points)
  }

  getRoles(id: string) {
    return this.http.get<IRole[]>(`${environment.apiUrl}/employees/${id}/roles`)
  }

  getConversations(id: string, page: number, size: number) {
    return this.http.get<IPage<IConversation[]>>(`${environment.apiUrl}/employees/${id}/conversations?page=${page}&size=${size}`)
  }

  getConversation(id: string, conId: string) {
    return this.http.get<IConversation>(`${environment.apiUrl}/employees/${id}/conversations/${conId}`)
  }

  createConversation(id: string, conversation: IConversation) {
    return this.http.post<IConversation>(`${environment.apiUrl}/employees/${id}/conversations`, conversation)
  }
}
