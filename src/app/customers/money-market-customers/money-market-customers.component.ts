import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-money-market-customers',
  templateUrl: './money-market-customers.component.html',
  styleUrls: ['./money-market-customers.component.scss']
})
export class MoneyMarketCustomersComponent extends SharedClassComponent implements OnInit {


  ngOnInit() {
  }

}
