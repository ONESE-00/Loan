import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Loan } from '../loans/loan';
import { Customer } from '../customers/customer';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepaymentsService {

// //MORGAN SERVER
private loansUrl      = "http://172.16.8.12:8000/loans"
private customerUrl   = "http://172.16.8.12:8000/customers"
private calcLoanUrl   =  "http://172.16.8.12:8000/loans/calculate"

//SERVER 2
// private loansUrl      = "http://172.16.8.19:8081/loans"
// private customerUrl   = "http://172.16.8.19:8081/customers"  

  constructor(private HttpClient: HttpClient) { }

  
  searchLoans(): Observable<any> {
    
    return this.HttpClient.get<Loan[]>(this.loansUrl)
    
  }


  calculateLoan(loanData: any): Observable<any> {
    return this.HttpClient.post<any>(this.calcLoanUrl, loanData);
  }

  //calculate loan
  // calcLoan(loanData: any): Observable<any>{


  //   this.HttpClient.post<any>(this.calcLoanUrl,loanData)
  // }
  







}

