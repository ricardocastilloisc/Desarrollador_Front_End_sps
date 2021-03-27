import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-menu-component',
  templateUrl: './menu-component.component.html',
  styleUrls: ['./menu-component.component.css'],
})
export class MenuComponentComponent implements OnInit {
  isLoggenIn = false;

  user:User;

  isDarkTheme: boolean = false;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private apiLogin: AuthService
  ) {}

  ngOnInit() {
    this.apiLogin.checkLogin();
    this.apiLogin.isUserLoggedIn.subscribe((val) => {
      this.isLoggenIn = val;
      this.user = this.apiLogin.getUser();
    });
    this.isDarkTheme = localStorage.getItem('theme') === 'Dark' ? true : false;
  }

  storeThemeSelection() {
    localStorage.setItem('theme', this.isDarkTheme ? 'Dark' : 'Light');
  }


  userAdmin():Boolean{
    if(this.user){
      if(this.user.hasOwnProperty("rol")){
        if(this.user.rol === 1){
          return true
        }else{
          false
        }
      }else{
        return false
      }
    }else{
      return false
    }
  }

  logout() {
    Swal.fire({
      title: '¿Vas a cerrar sesión?',
      text: '¿Estas seguro de cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.apiLogin.checkLogin();
        this.apiLogin.logoutUser();
        this.apiLogin.isUserLoggedIn.subscribe(
          (val) => (this.isLoggenIn = val)
        );

        new Promise((resolve) => {
          const intervalo = setInterval(() => {
            if (!this.isLoggenIn) {
              resolve('ok');
              clearInterval(intervalo);
            }
          }, 100);
        }).then(() => {
          this.router.navigate(['/login']);
        });
      }
    });
  }
}
