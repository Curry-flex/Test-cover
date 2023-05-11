import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-one-time-purchase-customers',
  templateUrl: './one-time-purchase-customers.component.html',
  styleUrls: ['./one-time-purchase-customers.component.scss']
})
export class OneTimePurchaseCustomersComponent extends SharedClassComponent implements OnInit {

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
  }

}
