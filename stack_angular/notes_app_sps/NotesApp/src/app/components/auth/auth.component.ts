import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;

  loggedIn = false;
  errorLogin = false;

  constructor(private api: AuthService, private route: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
        Validators.minLength(6),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  onSubmit() {
    if (!this.loginForm.invalid) {
      const user = {
        password: this.loginForm.value.password,
        email: this.loginForm.value.email,
      };
      this.api.loginUser(user);
      this.api.isUserLoggedIn.subscribe((val) => {
        this.loggedIn = val;
        new Promise((resolve) => {
          const intervalo = setInterval(() => {
            if (this.loggedIn) {
              resolve('ok');
              clearInterval(intervalo);
            }
          }, 100);
        })
          .then(() => {
            this.route.navigate(['/notes']);
          })
          .catch((err) => {
            this.errorLogin = err;
          });
      });
    }else{
      return
    }
  }
}
