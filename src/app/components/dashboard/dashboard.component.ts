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
    this.createDoughnutChart()
    

    this.createMiniLineChart('miniChart1', [10, 15, 12, 18, 20, 15, 19], '#FFFFFF'); // App Traffic
    this.createMiniLineChart('miniChart2', [3.0, 3.5, 4.2, 3.8, 4.0, 3.9], '#FFFFFF'); // Average Rating
    this.createMiniLineChart('miniChart3', [20, 22, 18, 24, 26, 30], '#FFFFFF'); // Site Visitors
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
            border: {
              color: 'rgb(255,255,255)'
            }
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
            border: {
              color: 'rgb(255,255,255)'
            }
            // grid: {
            //   color: '#e5e7eb'  // Light gray for grid lines
            // } 
          }
        }
      }
    });
  }

  //CREATE THE DOUGHNUT CHART
  createDoughnutChart() {
    const ctx = document.getElementById('myDoughnutChart') as HTMLCanvasElement;
  
    const data = {
      labels: ["Active", "Disbursed", "Pending", "Paid Off", "In Repayment", "Defaulted"],
      datasets: [{
        data: [6, 6, 1, 0, 5, 1], // Values
        backgroundColor: [
          '#39FF14', // Active - Teal
          '#00FFFF',  // Disbursed - Orange
          '#FFBF00',  // Pending - Yellow
          '#7DF9FF',  // Paid Off - Blue
          '#D200D2', // In Repayment - Purple
          '#DC143C'   // Defaulted - Red
        ],
        borderWidth: 0,
        hoverOffset: 10 // Adds hover effect
      }]
    };
  
    new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          title: {
            display: true,
            text: 'Loan Status Distribution',
            font: {
              size: 22
            }
          },
          legend: {
            position: 'top'
          }
        }
      }
    });
  }
  
  //CREATE THE MINI LINE CHARTS
  createMiniLineChart(chartId: string, chartData: number[], chartColor: string) {
    const ctx = document.getElementById(chartId) as HTMLCanvasElement;
    
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array(chartData.length).fill(''), // Empty labels
          datasets: [{
            data: chartData,
            borderColor: chartColor,
            borderWidth: 2,
            fill: false,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { display: false },
            y: { display: false }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }
  }



  

}
