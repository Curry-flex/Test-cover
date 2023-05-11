import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-customers-invoice',
  templateUrl: './customers-invoice.component.html',
  styleUrls: ['./customers-invoice.component.scss']
})
export class CustomersInvoiceComponent extends SharedClassComponent implements OnInit {

  datasource = [];
  invoceDetailsDatasource = [];
  hideViewDetailsTable = true;
  getInvDeatilsEndpoint = 'CUSTOMER_INVOICE_DETAILS';
  generateCustomerBill = 'CUSTOMER_BILL_GENARATE';

  invoiceId: any;
  invoiceType: any;
  customerId: any;
  customerName: any;
  postingDate: any;
  description: any;
  currency: any;
  amount: any;

  customerInvoiceId: any;

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.getAllCustomersInvoiceRecords();
  }
  getAllCustomersInvoiceRecords() {
    const data = {
      requestType: 'CUSTOMER_INVOICES',
      linkId: ''
    };
    this.spinner.show();
    this.utilities.postServiceCall(data, this.portalRequestEndPoint).subscribe(res => {
      this.datasource = [];
      if (res.code == 2000) {
        for (const iterator of res.data) {
          this.datasource.push(iterator);
        }
      } else {
        this.toastr.error(res.message);
      }
      this.spinner.hide();
    }, error => {
      this.toastr.error('Something went wrong please try again');
      this.spinner.hide();
    });
  }


  onViewAdditionalDetails(e) {
    const data = {
      requestType: 'CUSTOMER_INVOICE_DETAILS',
      customerInvoiceId: e.data.invoiceId
    };
    this.customerInvoiceId = e.data.invoiceId;
    this.spinner.show();
    this.utilities.postServiceCall(data, 'backend/request').subscribe(
      response => {
        this.invoceDetailsDatasource = [];
        this.invoiceId = null;
        this.invoiceType = null;
        this.customerId = null;
        this.customerName = null;
        this.postingDate = null;
        this.description = null;
        this.currency = null;
        this.amount = null;
        if (response.code == 2000) {
          this.invoiceId = response.data.invoiceId;
          this.invoiceType = response.data.invoiceType;
          this.customerId = response.data.customerId;
          this.customerName = response.data.customerName;
          this.postingDate = response.data.postingDate;
          this.description = response.data.description;
          this.currency = response.data.currency;
          this.amount = response.data.amount;

          try {
            for (const iterator of response.data.invoceDetails) {
              this.invoceDetailsDatasource.push(iterator);
            }
          } catch (error) {
            this.spinner.hide();
            this.toastr.error('Failed to get invoice Details');
          }


          this.hideViewDetailsTable = false;
        } else {
          this.toastr.error(response.message);
        }
        this.spinner.hide();
      },
      error => {
        this.toastr.error('Error Occured while processing the request, Error -> ' + error.message);
        this.spinner.hide();
      }
    );
  }

  onCloseViewDetailsTable() {
    this.hideViewDetailsTable = true;
  }

  onToolBarPreparing(e) {
    e.toolbarOptions.items.unshift( {
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'refresh',
        type: 'default',
        onClick: this.getAllCustomersInvoiceRecords.bind(this)
      }
    });

  }


  onCustomerBillGenerate(){
    const data = {
      requestType: 'CUSTOMER_BILL_GENERATE',
      customerInvoiceId: this.customerInvoiceId
    };
    this.spinner.show();
    this.utilities.postServiceCall(data, 'backend/request').subscribe(
      response => {
        if (response.code == 2000) {
          this.toastr.success('Bill created successfully.');
          sessionStorage.removeItem(AppSettings.billDetailsKey);
          sessionStorage.setItem(AppSettings.billDetailsKey, JSON.stringify(response.data));
          this.router.navigate(['/bill-payment-form']);
          this.hideViewDetailsTable = false;
        } else {
          this.toastr.error(response.message);
        }
        this.spinner.hide();
      },
      error => {
        this.toastr.error('Error occured while processing the request, Error -> ' + error.message);
        this.spinner.hide();
      }
    );
  }
}
