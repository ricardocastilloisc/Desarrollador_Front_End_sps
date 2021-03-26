import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  isLoggenIn = false;
  constructor(private route: Router, private apiLogin: AuthService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.apiLogin.checkLogin();
    this.apiLogin.isUserLoggedIn.subscribe((val) => (this.isLoggenIn = val));
    const auth = this.isLoggenIn;
    if (!auth) {
      localStorage.removeItem('token');
      this.route.navigate(['/login']).then(() => {
        window.location.reload();
      });
      return false;
    } else {
      const roles = next.data.roles as Array<string>;
      if (roles) {
        const match = this.apiLogin.roleMatch(roles);
        if (match) {
          return true;
        } else {
          this.route.navigate(['/notes']).then(() => {
            window.location.reload();
          });
          return false;
        }
      } else {
        return true;
      }
    }
    return true;
  }
}
