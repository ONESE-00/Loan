import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan } from './loan';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  private loansUrl      = "http://172.16.8.12:8000/loans"
  private customerUrl   = "http://172.16.8.12:8000/customers"

  constructor(private HttpClient: HttpClient) { }
  
  //GET ALL LOANS
  getLoans(): Observable<any>  {
    return this.HttpClient.get<Loan[]>(this.loansUrl)
  }

  //CREATE LOAN
  createLoan(loanData: Partial<Loan>): Observable<Loan> {
    
    return this.HttpClient.post<Loan>(this.loansUrl, loanData);
  }

  //UPDATE LOAN
  updateLoan(loan: any): Observable<any> {

    return this.HttpClient.put<any>(`${this.loansUrl}/${loan.id}`, loan);
  }

  //DELETE LOAN
  deleteLoan(loanid: number): Observable<any> {

    return this.HttpClient.delete<any>(`${this.loansUrl}/${loanid}`);
  }

  //API CALL TO AUTOCOMPLETE CUSTOMER NAMES
  searchCustomers(): Observable<string[]> {

    return this.HttpClient.get<{name: string }[]>(this.customerUrl).pipe(

      map(customers => customers.map(customer => customer.name))  
    );
    // return this.HttpClient.get<any>
  }
  

}
