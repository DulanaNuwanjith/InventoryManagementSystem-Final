import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  baseUrl

  requestHeader = new HttpHeaders(
    {
      "No-Auth": "True"
    }
  )

  isAuthenticated = new Subject<boolean>();
  constructor(private httpclient: HttpClient,) {
    this.baseUrl = environment.backendbaseUrl + "/auth";
  }

  public setRoles(roles: []) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  public getRoles(): string[] {
    const rolesJson = localStorage.getItem('roles');
    return rolesJson ? JSON.parse(rolesJson) : [];
  }

  public setToken(jwtToken: string) {
    localStorage.setItem("jwtToken", jwtToken)
  }

  public getToken(): string {
    return localStorage.getItem('jwtToken') as string || '';
  }

  public clear() {
    localStorage.clear();
  }

  public isLoggedIn(): boolean {
    return !!this.getRoles() && !!this.getToken();
  }

  logout() {
    this.isAuthenticated.next(false);
    localStorage.clear();
  }

  public login() {
    this.isAuthenticated.next(true);
  }

  public getAuthState(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('accessToken')
    });

    const body = {
      oldPassword: oldPassword,
      newPassword: newPassword
    };

    return this.httpclient.put(`${this.baseUrl}/updatepassword`, body, { headers: headers });
  }

}
