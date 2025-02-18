import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Statistics } from './statistics';
import { DashboardService } from './dashboard.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor (private HttpClient: HttpClient,
              private DashboardService: DashboardService) {}

  ngOnInit(): void{

    this.loadStats()
  }

  Statistics: Statistics[] = [];

  // loadStats() {

  //   this.DashboardService.getStats().subscribe({

  //     next: (response) => {

  //       this.Statistics = response;
  //       console.log("STATS!!",this.Statistics)

  //     },

  //     error: (error) => {
  //       console.error("ERROR FETCHING THE STATS",error)
  //   }})
  // }

  loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (response: Statistics[]) => {
        // Assuming we want the first item from the array
        this.statistics = response[0];
        console.log('Statistics loaded:', this.statistics);
      },
      error: (error) => {
        console.error('Error fetching statistics:', error);
      }
    });
  }


}
