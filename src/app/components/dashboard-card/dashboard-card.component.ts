import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.css']
})
export class DashboardCardComponent {

  constructor(private Router: Router){

  }

  ngOnInit(): void{

  }

  debugClick(event: Event){
    console.log("CLICKED",event)
  }

}
