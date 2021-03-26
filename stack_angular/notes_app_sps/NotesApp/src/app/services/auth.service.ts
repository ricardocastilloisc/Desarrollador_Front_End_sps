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
    try{
      const token = this.b64_to_utf8(localStorage.getItem('token'));
      if (token && !this.jwtHelp.isTokenExpired(token)) {
        this.checkStatus.next(true);
      } else {
        this.checkStatus.next(false);
      }
    }catch(error)
    {
      this.checkStatus.next(false);
    }
  }
  loginUser(user: any) {
    return this.http
      .post(`${this.host}/servicio/api_notes_app/auth`, user)
      .subscribe(
        (checkUser: any) => {
          if (checkUser.token) {
            localStorage.removeItem('error');
            localStorage.setItem('token', this.utf8_to_b64(checkUser.token));

            this.checkLogin();
          } else {
            localStorage.setItem('error', checkUser.error.msj);
            this.checkLogin();
          }
        },
        (error) => {
          this.checkLogin();
          localStorage.setItem('error', error.error.msj);
          return error.error
        }
      );
  }

  logoutUser() {
    localStorage.removeItem('token');
    this.checkLogin();
    return;
  }


  getMsjError(){
    return localStorage.getItem('error')
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




  utf8_to_b64(str: string): string {
    return window.btoa(unescape(encodeURIComponent(str)));
  }

  b64_to_utf8(str: string): string {
    return decodeURIComponent(escape(window.atob(str)));
  }

}
