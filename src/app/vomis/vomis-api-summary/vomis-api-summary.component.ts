import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';
import { confirm } from 'devextreme/ui/dialog';

@Component({
  selector: 'app-vomis-api-summary',
  templateUrl: './vomis-api-summary.component.html',
  styleUrls: ['./vomis-api-summary.component.scss']
})
export class VomisApiSummaryComponent extends SharedClassComponent implements OnInit {

  endpoint = "backend/request";

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.observerCall();
    this.requestType = 'VOMIS_API_SUMMARY';
    this.vomisApiReqRes();
  }

  onVomisPushHandler(e) {
    const data = {
      requestType:"VOMIS_PUSH",
		  pq_id : e.PQ_ID
    }
    const result = confirm(`Are you sure you want to push selected transaction ?`, 'Push Transaction');
    result.then(dialogResult => {
    if (dialogResult) {
    this.spinner.show();
      this.utilities.postServiceCall(data, this.endpoint).subscribe(res => {
        const serveResponse = res;
        if (serveResponse.code == 2000) {
          this.toastr.success(serveResponse.message);
          this.vomisApiReqRes();
        } else {
          this.toastr.error(serveResponse.message);
        }
        this.spinner.hide();
      }, err => {
        this.toastr.error("Something went wrong, while processing the request. Error Message: " + err.message)
        this.spinner.hide();
      });
      }
    });
  }

}
