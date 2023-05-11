import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-vomis-post-requests',
  templateUrl: './vomis-post-requests.component.html',
  styleUrls: ['./vomis-post-requests.component.scss']
})
export class VomisPostRequestsComponent extends SharedClassComponent implements OnInit {


  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.observerCall();
    this.requestType = 'VM_API_POST_REQUESTS';
    this.vomisApiReqRes();
  }

}
