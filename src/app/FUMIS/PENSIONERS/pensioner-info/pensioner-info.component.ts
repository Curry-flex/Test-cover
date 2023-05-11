import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pensioner-info',
  templateUrl: './pensioner-info.component.html',
  styleUrls: ['./pensioner-info.component.scss']
})
export class PensionerInfoComponent implements OnInit {

  constructor() { }

  pensionData: any = []

  ngOnInit() {

    this.pensionData =JSON.parse(sessionStorage.getItem("pensionData"))
  }

}
