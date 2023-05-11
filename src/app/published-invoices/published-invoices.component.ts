import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../app-settings';
import { SharedClassComponent } from '../shared/components/shared-class/shared-class.component';
import { confirm } from 'devextreme/ui/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-published-invoices',
  templateUrl: './published-invoices.component.html',
  styleUrls: ['./published-invoices.component.scss']
})
export class PublishedInvoicesComponent extends SharedClassComponent implements OnInit {

  title = 'Published Invoices';
  invoiceGeneratedByEmployerDataSource = [];
  invoiceGeneratedByIndividualDataSource = [];
  endPointCallInvoiceGenerated = 'employer/invoices';
  portalRqUrl = 'portal/request';
  selectedRows = [];
  allMode: string;
  checkBoxesMode: string;
  hideEmpDataGrid = false;
  customerForm: FormGroup;
  userGroup: any;
  currrentEmployerNumber: any;
  customerNumberSaved = false;
  currentCustomerName = '';
  customerType = [{
    text: 'Employer',
    value: 1
  },
  {
    text: 'Individual Contributor',
    value: 2
  }
];
USERGROUP = this.authService.getUserDetails().userGroup;
hideDeleteButton = false;
  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.customerForm = new FormGroup({
      customerNumber: new FormControl(null , Validators.compose([Validators.required])),
      customerType: new FormControl(1 , Validators.compose([Validators.required])),
    });
    this.allMode = 'page';
    this.checkBoxesMode = 'always';
    this.observerCall();
    this.appInfo.setTitle(this.title);
  }

  onCustomerTypeValueChange(e) {
    if (e.value == 1) {
      this.userGroup = 'EMPLOYER';
      this.hideEmpDataGrid = true;
    } else {
        this.userGroup = 'INDIVIDUAL_CONTRIBUTOR';
        this.hideEmpDataGrid = false;

    }
  }

  updateCustomerNumber() {

    if (this.customerForm.get('customerNumber').invalid) {
      this.toastr.error('Please enter customer number to continue');
      return;
    }

    const data = {
        requestType: 'FUMIS_MEMBER_DETAILS',
        memberType: '',
        memberRef: this.customerForm.get('customerNumber').value
    };

    if (this.customerForm.get('customerType').value == 1) {
      this.userGroup = 'EMPLOYER';
    } else {
        this.userGroup = 'INDIVIDUAL_CONTRIBUTOR';
    }

    data.memberType = this.userGroup;

    this.spinner.show();
    this.utilities.postServiceCall(data, 'backend/request').subscribe(res => {

      if (res.code == 2000) {
      this.currrentEmployerNumber = res.data.membershipNo;
      this.currentCustomerName = res.data.membeshipName;
      this.customerNumberSaved = true;

      if (this.customerForm.get('customerType').value == 2) {
        this.hideEmpDataGrid = true;
        this.getIndividualContributorInvoices()
      }

      if(this.customerForm.get('customerType').value == 1) {
        this.hideEmpDataGrid = false;
        this.getListOfGeneratedInvoices();
      }

      } else {
        this.toastr.error(res.message);
      }
      this.spinner.hide();
    });
  }



  deleteInvoice(e) {
      const result = confirm(
        'Do you want to cancel selected invoice ?\nClick Yes to continue',
        'Discard Changes'
      );

      result.then(dialogResult => {
        if (dialogResult) {
          const data = {
            requestType: 'INVOICE_DELETE',
            invoiceRef: e.id
          };

          this.spinner.show();
          this.utilities.postServiceCall(data, this.portalRqUrl).subscribe(res => {
            const serverResp = res;
            this.spinner.hide();
            if (serverResp.code == 2000) {
              this.toastr.success(serverResp.message, 'Invoice Delete');
              if (this.customerForm.get('customerType').value == 2) {
                this.hideEmpDataGrid = true;
                this.getIndividualContributorInvoices()
              }

              if(this.customerForm.get('customerType').value == 1) {
                this.hideEmpDataGrid = false;
                this.getListOfGeneratedInvoices();
              }
            } else {
              this.toastr.error(serverResp.message, 'Invoice Delete');
            }
          }, err => {
            this.spinner.hide();
            this.toastr.success('Something went wrong while processing the request.', 'Request Failed');
          });
        }
    });
  }

  getListOfGeneratedInvoices() {
    // const data = {
    //   employerNumber: this.currrentEmployerNumber
    // };

    const data = {
      requestType:"INVOICES_LIST",
      userGroup:"EMPLOYER",
      linkId: this.currrentEmployerNumber
    }
    this.spinner.show();
    this.utilities.postServiceCall(data, this.portalRqUrl).subscribe(res => {
    const serverResponse = res;
    if (serverResponse.code == 2000) {
      this.invoiceGeneratedByEmployerDataSource = serverResponse.data;
    } else {
      this.invoiceGeneratedByEmployerDataSource = [];
    }
    this.spinner.hide();
  });
}

getIndividualContributorInvoices() {
  const data = {
    requestType:'INVOICES_LIST',
    userGroup:'INDIVIDUAL_CONTRIBUTOR',
    linkId: this.currrentEmployerNumber
  };
  this.spinner.show();
  this.utilities.postServiceCall(data, this.portalRqUrl).subscribe(res => {
  const serverResponse = res;
  if (serverResponse.code == 2000) {
    this.invoiceGeneratedByIndividualDataSource = serverResponse.data;
  } else {
    this.invoiceGeneratedByIndividualDataSource = [];
  }
  this.spinner.hide();
});
}

getControlNumber(e) {

  // if (this.USERGROUP != 'COMPLIANCE_MANAGER' || this.USERGROUP != 'COMPLIANCE_OFFICER' || this.USERGROUP != 'SUPER_ADMIN'|| this.USERGROUP != 'ACCOUNTS_MANAGER' || this.USERGROUP != 'ACCOUNTS_OFFICER') {
  //   this.toastr.error('Only COMPLIANCE MANAGER or COMPLIANCE OFFICER or SUPER ADMIN or ACCOUNTS_MANAGER or ACCOUNTS_OFFICER can delete generated bills');
  //   return;
  // }
  const data = [{
    invoiceId: ''
  }]

  if (this.customerForm.get('customerType').value == 2) {
      data[0].invoiceId = e.InvoiceID
  } else {
    data[0].invoiceId = e.id
  }


  sessionStorage.removeItem(AppSettings.customerNumberKey);
  sessionStorage.removeItem(AppSettings.customerUserGroup);
  sessionStorage.removeItem(AppSettings.customerName);
  sessionStorage.removeItem(AppSettings.invoiceBillsItems);

  sessionStorage.setItem(AppSettings.customerNumberKey, this.securityService.encryptString(this.currrentEmployerNumber));
  sessionStorage.setItem(AppSettings.customerUserGroup, this.userGroup);
  sessionStorage.setItem(AppSettings.customerName, this.securityService.encryptString(this.currentCustomerName))
  sessionStorage.setItem(AppSettings.invoiceBillsItems, this.securityService.encryptString(data));

  this.router.navigate(['/multiple-contribution-invoice']);
}

generateControlNumber() {

  // if(this.USERGROUP != 'COMPLIANCE_MANAGER' || this.USERGROUP != 'COMPLIANCE_OFFICER' || this.USERGROUP != 'SUPER_ADMIN'|| this.USERGROUP != 'ACCOUNTS_MANAGER' || this.USERGROUP != 'ACCOUNTS_OFFICER') {
  //   this.toastr.error('Only COMPLIANCE MANAGER or COMPLIANCE OFFICER or SUPER ADMIN or ACCOUNTS_MANAGER or ACCOUNTS_OFFICER can delete generated bills');
  //   return;
  // }

  if (this.selectedRows === undefined) {
    this.toastr.info('Please select invoices with status \"No Control Number\" only');
    return;
  }
  // this.router.navigate(['/multiple-contribution-invoice'], {queryParams: {invoiceId: el.id}, queryParamsHandling: 'merge'});
  const inVoiceData = [];
  const invoiceWithControlNumber = [];
  const invoiceWithoutControlNumber = [];

  this.invoiceGeneratedByEmployerDataSource.forEach(el => {
    if (el.isPosted == 2 || el.isPosted == 1) {
      invoiceWithControlNumber.push(el.id);
    }
});

  // tslint:disable-next-line: prefer-for-of
  for (let index = 0; index < invoiceWithControlNumber.length; index++) {
  if (this.selectedRows.includes(invoiceWithControlNumber[index])) {
    this.toastr.error('Please select invoices with status \"No Control Number\" only');
    return;
  }
}

  if (this.selectedRows !== undefined) {
    this.selectedRows.forEach(element => {
      inVoiceData.push({
        invoiceId: element
      });
    });
  }
  sessionStorage.removeItem(AppSettings.invoiceBillsItems);
  sessionStorage.setItem(AppSettings.invoiceBillsItems, this.securityService.encryptString(inVoiceData));

  this.router.navigate(['/multiple-contribution-invoice']);
}

printPaymentReceipt(el) {
  this.toastr.success('Payment receipt clicked');
  // this.router.navigate(['/multiple-contribution-invoice'], {queryParams: {invoiceId: el.id}, queryParamsHandling: 'merge'});
}

viewInvoiceDetails(el) {
  this.toastr.success('View invoice clicked');
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
