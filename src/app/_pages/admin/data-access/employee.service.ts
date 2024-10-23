import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {IPage} from "../../../_models/page.interface";
import {IUser} from "../utils/user";
import {IRole} from "../utils/role";
import {IConversation} from "../utils/conversation";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) {
  }

  getTest() {
    return this.http.get<any>(`${environment.apiUrl}/employees/test`)
  }

  getEmployees(page: number, size: number, allEmployees: boolean, search: string) {
    return this.http.get<IPage<IUser[]>>(`${environment.apiUrl}/employees?page=${page}&size=${size}&all=${allEmployees}&search=${search}`)
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

  patchEmployeeFunction(id: string, functionGroup: string) {
    return this.http.patch<IUser>(`${environment.apiUrl}/employees/${id}/functionGroup`, functionGroup)
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

// Files
  updateConversation(id: string, conId: string, conversation: IConversation) {
    return this.http.patch<IConversation>(`${environment.apiUrl}/employees/${id}/conversations/${conId}`, conversation)
  }

  deleteConversation(id: string, conId: string) {
    return this.http.delete(`${environment.apiUrl}/employees/${id}/conversations/${conId}`)
  }

  getFiles(id: string, conId: string) {
    return this.http.get<any>(`${environment.apiUrl}/employees/${id}/conversations/${conId}/files`)
  }

  uploadFile(id: string, conId: string, file: File): Observable<HttpEvent<{}>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${environment.apiUrl}/employees/${id}/conversations/${conId}/files`, formData, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  downloadFile(id: string, conId: string, name: string) {
    return this.http.post<any>(`${environment.apiUrl}/employees/${id}/conversations/${conId}/files/download`, name, {
      reportProgress: true,
      responseType: 'blob' as 'json'
    })
  }

  updateFile(id: string, conId: string, name: string, tags: { locked: boolean }) {
    return this.http.patch<any>(`${environment.apiUrl}/employees/${id}/conversations/${conId}/files/${name}`, tags)
  }

  deleteFile(id: string, conId: string, name: string) {
    return this.http.delete<any>(`${environment.apiUrl}/employees/${id}/conversations/${conId}/files/${name}`);
  }
}
