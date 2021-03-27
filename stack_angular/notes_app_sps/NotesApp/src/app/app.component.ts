import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'NotesApp';
  isLoggenIn = false;
  constructor(private router: Router, private apiLogin: AuthService){
  }
  ngOnInit(): void {
    this.apiLogin.checkLogin();
    this.apiLogin.isUserLoggedIn.subscribe((val) => {
      this.isLoggenIn = val;
    });
  }
}
