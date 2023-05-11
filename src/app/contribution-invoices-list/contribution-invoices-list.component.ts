import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedClassComponent } from '../shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-contribution-invoices-list',
  templateUrl: './contribution-invoices-list.component.html',
  styleUrls: ['./contribution-invoices-list.component.scss']
})
export class ContributionInvoicesListComponent extends SharedClassComponent implements OnInit {

  datasource = [];
  searchForm: FormGroup;
  title = 'Contribution Invoices List';

  paymentStatusDatasource = [
    {
      id: 'FULL PAID',
      value: 'FULL PAID'
    },
    {
      id: 'PARTIAL PAID',
      value: 'PARTIAL PAID'
    },
    {
      id: 'NOT PAID',
      value: 'NOT PAID'
    },
    {
      id: 'ALL',
      value: 'ALL'
    },
  ];

  ngOnInit() {
    this.appInfo.setTitle(this.title);
    this.observerCall();
    this.searchForm = new FormGroup({
      requestType: new FormControl('FUMIS_INVOICES_LIST'),
      date: new FormControl(),
      employerNo: new FormControl(),
      controlNo: new FormControl(),
      memberNo: new FormControl(),
      invoiceNo: new FormControl(),
      payStatus: new FormControl()
    });
  }

  contributionInvoicesList() {
    if (this.searchForm.get('date').value !== null &&
    `${this.searchForm.get('date').value}`.replace(/\s/g,'') != '') {
      if (!this.isValidDate(this.searchForm.get('date').value)) {
        this.toastr.error('The date format was invalid, please consider to use valid date format(yyyy-MM-dd)');
        this.spinner.hide();
        return;
      }
    }
    this.searchForm.get('requestType').patchValue('FUMIS_INVOICES_LIST');
    this.spinner.show();
    this.utilities.baseApiPostServiceCall(this.searchForm.value).subscribe(res => {
      if(res.code == 2000) {
        this.datasource = res.data;
      } else {
        this.toastr.error(res.message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error('Something went wrong while processing the request', 'Request Failed');
      console.log(err);
    });
  }

}
