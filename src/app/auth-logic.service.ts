import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class AuthLogicService {
  
  private LoginUrl =  "http://172.16.8.24:8080/auth/login"
  private SignUpUrl = "http://172.16.8.24:8080/auth/register"
  private ForgotPasswordUrl = ""


  constructor( private http: HttpClient) { }

  //login
  Login(email:string, password:string): Observable<any> {
    
    return this.http.post<any>(this.LoginUrl, {email, password});

  }

  //register
  SignUp(username:string, firstname:string, lastname:string, email:string, password:string): Observable<any> {

    return this.http.post<any>(this.SignUpUrl, {username, firstname, lastname, email, password})
  }

  //forgot password
  ForgotPassword(email:string): Observable<any> {

    return this.http.post<any>(this.ForgotPasswordUrl, {email})
  }
  
}
