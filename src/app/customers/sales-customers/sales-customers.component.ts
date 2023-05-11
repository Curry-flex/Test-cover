import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-sales-customers',
  templateUrl: './sales-customers.component.html',
  styleUrls: ['./sales-customers.component.scss']
})
export class SalesCustomersComponent extends SharedClassComponent implements OnInit {

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
  }

}
