import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-vomis-validation-requests',
  templateUrl: './vomis-validation-requests.component.html',
  styleUrls: ['./vomis-validation-requests.component.scss']
})
export class VomisValidationRequestsComponent extends SharedClassComponent implements OnInit {

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.observerCall();
    this.requestType = 'VM_API_VD_REQUESTS';
    this.vomisApiReqRes();
  }

}
