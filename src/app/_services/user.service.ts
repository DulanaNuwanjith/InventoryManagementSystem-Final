import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuthService } from './user-auth.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

interface LoginData {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl
  requestHeader = new HttpHeaders(
    {
      "No-Auth": "True"
    }
  )

  constructor(
    private httpclient: HttpClient,
    private userAuthService: UserAuthService
  ) {
    this.baseUrl = environment.backendbaseUrl + "/auth";
  }

  public login(loginData: LoginData) {
    return this.httpclient.post(this.baseUrl + "/signin", loginData, { headers: this.requestHeader })
  }

  public roleMatch(allowedRoles: string[]): boolean {
    const userRoles: string[] | null = this.userAuthService.getRoles();

    if (userRoles !== null) {
      for (let i = 0; i < userRoles.length; i++) {
        for (let j = 0; j < allowedRoles.length; j++) {
          if (userRoles[i] === allowedRoles[j]) {
            return true;
          }
        }
      }
    }

    return false;
  }

  register(userData: any) {
    return this.httpclient.post(this.baseUrl + "/signup", userData)
  }

  getUsers(): Observable<any[]> {
    return this.httpclient.get<any[]>(this.baseUrl + "/users");
  }

  updateUserState(userId: number, newState: string): Observable<any> {
    return this.httpclient.put<any>(
      `${this.baseUrl}/updateuserstate/${userId}`,
      { newState }
    );
  }

  getCurrentUserDetails(): Observable<any> {
    return this.httpclient.get<any>(`${this.baseUrl}/user`);
  }

  updateUserProfile(updatedProfile: any): Observable<any> {
    return this.httpclient.put(`${this.baseUrl}/updateprofile`, updatedProfile);
  }

}