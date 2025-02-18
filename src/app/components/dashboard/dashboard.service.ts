import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Statistics } from './statistics';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private HttpClient: HttpClient) { }

  private statisticsUrl = "http://172.16.8.12:8000/loans/statistics"

  // //GET THE STATS
  // getStats(): Observable<Statistics[]> {
  
  //   return this.HttpClient.get<Statistics[]>(this.statisticsUrl)
  // }

  getStats(): Observable<Statistics> {
    return this.HttpClient.get<Statistics[]>(this.statisticsUrl).pipe(
      map(response => response[0])
    );
  }


}
