import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private host: string = environment.url;

  checkStatus = new BehaviorSubject<boolean>(false);
  isUserLoggedIn = this.checkStatus.asObservable();

  constructor(private http: HttpClient, private jwtHelp: JwtHelperService) {}
  checkLogin() {
    const token = localStorage.getItem('token');
    if (token && !this.jwtHelp.isTokenExpired()) {
      this.checkStatus.next(true);
    } else {
      this.checkStatus.next(false);
    }
  }
  loginUser(user: any) {
    return this.http
      .post(`${this.host}/servicio/api_notes_app/auth`, user)
      .subscribe(
        (checkUser: any) => {
          if (checkUser.token) {
            localStorage.setItem('token', checkUser.token);
          } else {
            localStorage.setItem('error', 'true');
            localStorage.setItem('errorM', checkUser.error);
            this.checkLogin();
          }
        },
        (error) => {
          localStorage.setItem('error', 'true');
          this.checkLogin();
        }
      );
  }

  logoutUser() {
    localStorage.removeItem('token');
    this.checkLogin();
    return;
  }

  roleMatch(allowedRoles): boolean {
    var isMatch = false;
    const user = JSON.parse(localStorage.getItem('user'));
    let userRoles = [user['rol']];
    allowedRoles.forEach(element => {
      if (userRoles.indexOf(element) > -1) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }
}
