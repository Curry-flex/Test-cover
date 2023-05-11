import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employer-info',
  templateUrl: './employer-info.component.html',
  styleUrls: ['./employer-info.component.scss']
})
export class EmployerInfoComponent implements OnInit {

  employerInfo: any = []
  employerInfoBefore = []
  constructor() { }

  ngOnInit() {
    this.employerInfo =JSON.parse(sessionStorage.getItem("singleEmployerData"))
    //console.log(this.employerInfo.EmployerNumber)
    }

 

}
