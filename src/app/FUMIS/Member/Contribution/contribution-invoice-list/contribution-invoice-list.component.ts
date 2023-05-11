import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-contribution-invoice-list',
  templateUrl: './contribution-invoice-list.component.html',
  styleUrls: ['./contribution-invoice-list.component.scss']
})
export class ContributionInvoiceListComponent extends SharedClassComponent implements OnInit {

  invoiceList: any = []

  ngOnInit() {
    this.getInvoiceList()
  }


  getInvoiceList() {
    const data = {
      requestType: "CONTRIBUTION_INVOICE_LIST_ALL",
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.invoiceList = response.data;
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

}
