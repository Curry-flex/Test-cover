import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-vomis-validation-responses',
  templateUrl: './vomis-validation-responses.component.html',
  styleUrls: ['./vomis-validation-responses.component.scss']
})
export class VomisValidationResponsesComponent extends SharedClassComponent implements OnInit {

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.observerCall();
    this.requestType = 'VM_API_VD_RESPONSES';
    this.vomisApiReqRes();
  }

}
