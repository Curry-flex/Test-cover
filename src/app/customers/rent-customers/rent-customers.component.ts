import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-rent-customers',
  templateUrl: './rent-customers.component.html',
  styleUrls: ['./rent-customers.component.scss']
})
export class RentCustomersComponent extends SharedClassComponent implements OnInit {

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
  }

}
