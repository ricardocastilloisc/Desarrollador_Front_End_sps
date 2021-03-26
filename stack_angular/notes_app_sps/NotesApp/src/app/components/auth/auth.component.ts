import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { logging } from 'protractor';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup;

  loggedIn = false;
  errorLogin = false;

  errmsg: string;

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


      this.api.isUserLoggedIn.subscribe(
        (val) => {
          this.loggedIn = val;
          console.log(this.loggedIn);
          new Promise((resolve) => {
            const intervalo = setInterval(() => {
              console.log(this.loggedIn)
              if (this.loggedIn || this.errorLogin) {
                console.log(this.loggedIn);
                resolve('ok');
                clearInterval(intervalo);
              }
            }, 100);
          }).then(() => {
            if(this.loggedIn || !this.errorLogin)
            {
              this.route.navigate(['/notes']);
            }
          });
          if(this.api.getMsjError()){
            this.errorLogin = true;
            this.errmsg = this.api.getMsjError();
          }

        },
      );
    } else {
      return;
    }
  }
}
