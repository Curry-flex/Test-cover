import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-correct-list',
  templateUrl: './correct-list.component.html',
  styleUrls: ['./correct-list.component.scss']
})
export class CorrectListComponent extends SharedClassComponent implements OnInit {

  tab_paneldata: any = [{
    ID: 1,
    icon: '',
    name: 'Pending',
}, {
    ID: 2,
    icon: '',
    name: 'Approved',
}
];

pendingListDatasource=[]
approvedListDatasource=[]
  

  ngOnInit() {
    this.pendingList()
    this.ApprovedList()
  }


  pendingList() {

   
    this.spinner.show();
    const data = {
      requestType:"BILL_AMOUNT_CORRECT_LIST",
		  scope : "PENDING",
 
    }

    this.utilities.postServiceCall(data, '').subscribe(res => {

      const serveResponse = res;
      if (serveResponse.code == 2000) {
        //this.toastr.success(serveResponse.message);
        this.pendingListDatasource= serveResponse.data
        //console.log(serveResponse.data)
      } else {
        this.toastr.error(serveResponse.message);
        
      }
      this.spinner.hide();
    }, err => {
      this.toastr.error("Something went wrong, while processing the request. Error Message: " + err.message)
      this.spinner.hide();
    });
  }

  ApprovedList() {

   
    this.spinner.show();
    const data = {
      requestType:"BILL_AMOUNT_CORRECT_LIST",
		  scope : "APPROVED",
 
    }

    this.utilities.postServiceCall(data, '').subscribe(res => {

      const serveResponse = res;
      if (serveResponse.code == 2000) {
        //this.toastr.success(serveResponse.message);
        this.approvedListDatasource= serveResponse.data
        //console.log(serveResponse.data)
      } else {
        this.toastr.error(serveResponse.message);
        
      }
      this.spinner.hide();
    }, err => {
      this.toastr.error("Something went wrong, while processing the request. Error Message: " + err.message)
      this.spinner.hide();
    });
  }


}
