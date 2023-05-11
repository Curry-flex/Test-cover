import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-vomis-post-responses',
  templateUrl: './vomis-post-responses.component.html',
  styleUrls: ['./vomis-post-responses.component.scss']
})
export class VomisPostResponsesComponent extends SharedClassComponent implements OnInit {

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.observerCall();
    this.requestType = 'VM_API_POST_RESPONSES';
    this.vomisApiReqRes();
  }

}
