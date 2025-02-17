import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from './customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private customersUrl = "http://172.16.8.12:8000/customers"

  constructor(private HttpClient: HttpClient) { }
  
  //get all customers
  getCustomers(): Observable<any>  {
    return this.HttpClient.get<Customer[]>(this.customersUrl)
  }

  createCustomer(customerData: Partial<Customer>): Observable<Customer> {

    return this.HttpClient.post<Customer>(this.customersUrl, customerData);
  }

  //UPDATE CUSTOMER TABLE AFTER EDITING
  updateCustomer(customer: any): Observable<any> {

    return this.HttpClient.put<any>(`${this.customersUrl}/${customer.id}`, customer);
  }

  //DELETE CUSTOMER
  deleteCustomer(customerId: number): Observable<any>{

    return this.HttpClient.delete<any>(`${this.customersUrl}/${customerId}`);
  }

  bulkDeleteCustomers(customerIds: number[]): Observable<any> {

    // const params = new HttpParams().set('ids', customerIds.join(','));
    
    // return this.HttpClient.delete<void>(`${this.customersUrl}`, {params});
    return this.HttpClient.request('delete', `${this.customersUrl}`, { body: customerIds });

  }
}
