import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable, Subject } from 'rxjs';
import jwt_decode from 'jwt-decode';

import { Users } from '../interfaces/users.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthService {

  constructor(
    private httpClient: HttpClient,
    ) { }

  private baseURL: string = "http://localhost:3000/users/login";
  private isLogged = new Subject<boolean>();

  login(loginUser: Users): Promise<any> {
    return lastValueFrom(this.httpClient.post<any>(this.baseURL, loginUser));
  }

  loggedIn() {
    this.isLogged.next(true);
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }

  logout() {
    localStorage.removeItem('user-token');
    this.isLogged.next(false);
  }

  loginStatusChange(): Observable<boolean> {
    return this.isLogged.asObservable();
  }

  getId() {
    const token = localStorage.getItem('user-token');
    if (token) {
      const tokenInfo = this.getDecodedAccessToken(token);
      return tokenInfo.user_id;
    }
  }

  getRole() {
    const token = localStorage.getItem('user-token');
    if (token) {
      const tokenInfo = this.getDecodedAccessToken(token);
      return tokenInfo.user_role;
    }
  }

  getTokenHeader(): any {
    const token = localStorage.getItem('user-token');
    let httpOptions;

    if (token) {
      httpOptions = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "authorization": token
        })
      }
      return httpOptions;
    };
  }
}
