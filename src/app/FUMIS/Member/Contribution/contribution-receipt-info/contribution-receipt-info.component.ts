import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contribution-receipt-info',
  templateUrl: './contribution-receipt-info.component.html',
  styleUrls: ['./contribution-receipt-info.component.scss']
})
export class ContributionReceiptInfoComponent implements OnInit {
  recepientInfo: any = [];

  constructor() { }

  ngOnInit() {
    this.recepientInfo =JSON.parse(sessionStorage.getItem("singleReceiptData"))
  }

}
