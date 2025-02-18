import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Statistics } from './statistics';
import { DashboardService } from './dashboard.service';
import { map } from 'rxjs';

import { Chart,registerables } from 'chart.js';
Chart.register(...registerables)

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
    this.createLineChart()
  }

  Statistics: Statistics[] = [];

  loadStats() {

    const lineChart = document.getElementById("LineChart") as HTMLCanvasElement

    this.DashboardService.getStats().subscribe({

      next: (response) => {

        this.Statistics = response;
        console.log("STATS!!",this.Statistics)

        //LINE CHART
        // new Chart(lineChart, {
        //   type: 'line',
        //   data: {
        //     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        //     datasets: [{
        //       label: 'Total Disbursed',
        //       data: response.map(stat => stat.totalDisbursed),
        //       borderColor: 'rgb(75, 192, 192)',
        //       tension: 0.1
        //     }, {
        //       label: 'Total Paid',
        //       data: response.map(stat => stat.totalPaid),
        //       borderColor: 'rgb(255, 99, 132)',
        //       tension: 0.1
        //     }]
        //   },
        //   options: {
        //     responsive: true,
        //     maintainAspectRatio: false,
        //     scales: {
        //       y: {
        //         beginAtZero: true
        //       }
        //     }
        //   }
        // });



      },

      error: (error) => {
        console.error("ERROR FETCHING THE STATS",error)
    }})
  }

  createLineChart() {
    const ctx = document.getElementById('myLineChart') as HTMLCanvasElement;
    
    // Dummy data
    const dummyData = {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      totalDisbursed: [50000, 65000, 85000, 75000, 90000, 100000],
      totalPaid: [30000, 45000, 60000, 55000, 70000, 85000],
      outstandingBalance: [20000, 20000, 25000, 20000, 20000, 15000]
    };

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dummyData.months,
        datasets: [
          {
            label: 'Total Disbursed',
            data: dummyData.totalDisbursed,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            fill: false
          },
          {
            label: 'Total Paid',
            data: dummyData.totalPaid,
            borderColor: 'rgb(255,255,255)',
            tension: 0.1,
            fill: false
          },
          {
            label: 'Outstanding Balance',
            data: dummyData.outstandingBalance,
            borderColor: 'rgb(255, 205, 86)',
            tension: 0.1,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Loan Statistics Over Time',
            font: {
              size: 26
            }
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount (KES)',
              color: 'rgb(255,255,255)'
            },
            ticks: {
              color: 'rgb(255,255,255)'  // Gray color for y-axis labels
            },
            // grid: {
            //   color: '#e5e7eb'  // Light gray for grid lines
            // }
          },
          x: {
            title: {
              display: true,
              text: 'Month',
              color: 'rgb(255,255,255)'
            },
            ticks: {
              color: 'rgb(255,255,255)'  // Gray color for x-axis labels
            },
            // grid: {
            //   color: '#e5e7eb'  // Light gray for grid lines
            // } 
          }
        }
      }
    });
  }


  

}
