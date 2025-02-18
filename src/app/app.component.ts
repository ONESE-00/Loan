import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables)

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'loan_management_sys';

  constructor(private Router: Router) {}

  isAuthenticationPage(): boolean{
    const AuthPages = ['/auth','/login','/forgot-password','register'];
    return AuthPages.includes(this.Router.url)
  }

  isForgotPassword(): boolean{

    return this.Router.url === '/forgot-password'
  }

  isLogin(): boolean{

    return this.Router.url ===  '/login'
  }

  isAuth(): boolean{

    return this.Router.url === '/auth'
  }
}
