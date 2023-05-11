import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-bill-payment-summary',
  templateUrl: './bill-payment-summary.component.html',
  styleUrls: ['./bill-payment-summary.component.scss']
})
export class BillPaymentSummaryComponent extends SharedClassComponent implements OnInit {

  title = 'Bill Payments Summary & Contributions Allotment';
  endPoint = 'backend/request';
  billPaymentDatasource = [];
  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.appInfo.setTitle(this.title);
    this.getBillPaymentSummary();
  }


  getBillPaymentSummary() {
    const data = {
      requestType: 'BILL_PAYMENTS_SUMMARY'
    };
    this.spinner.show();
    this.utilities.postServiceCall(data, this.endPoint).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.billPaymentDatasource = [];
          this.billPaymentDatasource = response.data;
        } else {
          this.toastr.error(response.message, 'Error');
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(
          'Something went wrong please try again',
          'Request Failed'
        );
      }
    );
  }

  employerAllotment(data) {
    const request = {
      "requestType": "FUMIS_ALLOTMENT",
      "billId": data.billId
    };
    this.spinner.show();
    this.utilities.postServiceCall(request, this.endPoint).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.toastr.success(res.message);
          this.getBillPaymentSummary();
          this.spinner.hide();
        } else {
          this.toastr.error(response.message, 'Error');
          this.spinner.hide();
        }
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(
          'Something went wrong please try again',
          'Request Failed'
        );
      }
    );
  }


  toolBarPreparing(e, refresh_action) {
    e.toolbarOptions.items.unshift(
         {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          type: 'default',
          onClick: refresh_action.bind(this)
        }
      }
    );
  }
}
