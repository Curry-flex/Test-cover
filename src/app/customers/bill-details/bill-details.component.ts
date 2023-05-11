import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';
import { confirm } from 'devextreme/ui/dialog';

@Component({
  selector: 'app-bill-details',
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.scss']
})
export class BillDetailsComponent extends SharedClassComponent implements OnInit {

  title = 'Contributions & penalties Imposed';
  allMode: string;
  checkBoxesMode: string;
  penaltyInvoicesDataSource = [];
  contributionInvoicesDataSource = [];
  selectedPenaltyInvoices = [];
  selectedRows: number[];
  disableNextButton = true;
  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.allMode = 'allPages';
    this.checkBoxesMode = 'always';

    this.spinner.show();
    const invoiceData = this.securityService.decryptString(sessionStorage.getItem(AppSettings.invoiceDetailsKey));
    console.log(invoiceData)
    console.log("above is invoice data")
    if (invoiceData === null || invoiceData === undefined) {
          this.spinner.hide();
          return;
        }
    const data = {
      requestType: "INVOICE_DETAILS",
      invoiceId: invoiceData.contributionInvoice.id
    };
    this.utilities.postServiceCall(data, 'backend/request').subscribe(res => {
      const serverResponse = res;
      if (serverResponse.code == 2000) {
        this.contributionInvoicesDataSource.push(serverResponse.data.invoiceDetails);
        this.disableNextButton = false;
      } else {
        this.toastr.error(serverResponse.message);
      }
      this.spinner.hide();
    }, error => {
      this.toastr.error('Something went wrong, please try again later Error -> ' + JSON.stringify(error));
      this.spinner.hide();
    });
    this.spinner.hide();
    this.penaltyInvoicesDataSource = invoiceData.invoicePenalties;

  }


  submitInvoices() {
    // this.selectedPenaltyInvoices
    const inVoiceData = [];
    for (const el of this.contributionInvoicesDataSource) {
        inVoiceData.push({
          invoiceId: el.id
        });
    }
    if (this.selectedRows !== undefined) {
      this.selectedRows.forEach(element => {
        inVoiceData.push({
          invoiceId: element
        });
      });
    }
    
    sessionStorage.removeItem(AppSettings.invoiceBillsItems);
    sessionStorage.setItem(AppSettings.invoiceBillsItems,  this.securityService.encryptString(inVoiceData));
    this.router.navigate(['/multiple-contribution-invoice']);
  }

  discardChanges() {
    const result = confirm(
      'Do you want to cancel an invoice creation operation?',
      'Discard Changes'
    );

    result.then(dialogResult => {
      if (dialogResult) {
        for (const el of this.contributionInvoicesDataSource) {
             this.deleteInvoice(el.id);
      }
        this.penaltyInvoicesDataSource.forEach(element => {
        this.deleteInvoice(element.invoiceID);
      });
      }
  });
}

deleteInvoice(invoiceID) {
  const data = {
    invoiceID
  };
  this.utilities.postServiceCall(data, 'invoices/delete').subscribe( res => {
    const serverRes = res;
    if (serverRes.code == 2000) {
      // add logic to clear invoice
        sessionStorage.removeItem(AppSettings.invoiceStorageKey);
        sessionStorage.removeItem(AppSettings.invoiceDetailsKey);
        sessionStorage.removeItem(AppSettings.batchContributionInvoiceResultDataKey);
        sessionStorage.removeItem(AppSettings.contributionBatchMonthKey);
        sessionStorage.removeItem(AppSettings.invoiceBillsItems);
        sessionStorage.removeItem(AppSettings.contributionInvoiceIdKey);
    }
  }, error => {
  });
}

  contributionInWords(rowData) {
    if (rowData.penaltyContributionMonth == 1) {
      return 'January';
    } else if (rowData.penaltyContributionMonth == 2) {
      return 'February';
    } else if (rowData.penaltyContributionMonth == 3) {
      return 'March';
    } else if (rowData.penaltyContributionMonth == 4) {
      return 'April';
    } else if (rowData.penaltyContributionMonth == 5) {
      return 'May';
    } else if (rowData.penaltyContributionMonth == 6) {
      return 'June';
    } else if (rowData.penaltyContributionMonth == 7) {
      return 'July';
    } else if (rowData.penaltyContributionMonth == 8) {
      return 'August';
    } else if (rowData.penaltyContributionMonth == 9) {
      return 'September';
    } else if (rowData.penaltyContributionMonth == 10) {
      return 'October';
    } else if (rowData.penaltyContributionMonth == 11) {
      return 'November';
    } else if (rowData.penaltyContributionMonth == 12) {
      return 'December';
    }
}

funcpopHeigt(percentage_height) {
  return (window.innerHeight * percentage_height) / 100;
}

}
