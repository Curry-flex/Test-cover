import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';
import { confirm } from 'devextreme/ui/dialog';
import { AppSettings } from 'src/app/app-settings';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-multiple-contributions',
  templateUrl: './multiple-contributions.component.html',
  styleUrls: ['./multiple-contributions.component.scss']
})
export class MultipleContributionsComponent extends SharedClassComponent implements OnInit {
  multipleContributionsDatasource = [];
  title = 'Review and confirm contributions details';
  apiCallEndpoint = 'fumis_bill/create';
  invoiceContributionsEndPoint = 'backend/request';
  selectedItems: any[] = [];
  allowDeleting: boolean = true;
  deleteType: string = 'toggle';
  hideCancelInvoiceButton = true;
  hideCreateInvoiceButton = true;
  contextItems: any;
  invoiceID: any;
  invoicePenalties = [];
  invoiceContribution = [];
  userGroup: any;
  hideViewControls = false;
  hideDeleteOnOneInvoiceEntry = true;

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
        // Controls the datagrid height and max rows to display
        this.observerCall();
        // sets the current page title in index.html title tag
        this.appInfo.setTitle(this.title);

        this.userGroup = sessionStorage.getItem(AppSettings.customerUserGroup);

        // INDIVIDUAL_CONTRIBUTOR

    if (`${this.userGroup}`.match('INDIVIDUAL_CONTRIBUTOR')) {
      this.hideViewControls = true;
    }

        this.contextItems = [
      {
       text: 'Add Contributions',
       icon: 'dx-icon-add'
      },
      {
        text: 'Update Contributions',
        icon: 'dx-icon-edit'
      },
      {
        text: 'Delete Contributions',
        icon: 'dx-icon-close'
      }
  ];

        this.spinner.show();
        const invoiceData = this.securityService.decryptString(sessionStorage.getItem(AppSettings.invoiceDetailsKey));
        console.log(invoiceData)
        if (invoiceData === null || invoiceData === undefined) {
          this.spinner.hide();
          return;
        }
        this.spinner.hide();
        try {
          this.invoiceID = invoiceData.contributionInvoice.id;
        } catch (error) {
          console.error('API error has occured.');
          this.toastr.error("Something went wrong while processing the requested data(EX-BL-01).");
          return;
        }

        try {
          for (const iterator of invoiceData.invoicePenalties) {
            this.invoicePenalties.push({
                penaltyInvoiceId:  iterator.invoiceID,
                contributionMonth:  iterator.penaltyContributionMonth
            });
          }
        } catch (error) {
          console.error('API error has occured.');
          this.toastr.error("Something went wrong while processing the requested data(EX-BL-02).");
        }
        const data = {
          requestType: "INVOICE_DETAILS",
          invoiceId: this.invoiceID
        };
        this.spinner.show();
        this.utilities.postServiceCall(data, this.invoiceContributionsEndPoint).subscribe(res => {
          const serverResp = res;
          console.log("INSIDE MULTIPLE CONTRIBUTION")
          console.log(serverResp)
          if (serverResp.code == 2000) {
            //this.multipleContributionsDatasource = serverResp.data.invoiceContributions;
            this.multipleContributionsDatasource = serverResp.data.invoiceDetails;

            if (this.multipleContributionsDatasource.length > 1) {
              this.hideDeleteOnOneInvoiceEntry = false
            }
          } else {
            this.toastr.error('Failed to load contribution data', serverResp.message);
          }
          this.spinner.hide();
        }, err => {
          this.spinner.hide();
          this.toastr.error("Something went wrong while processing the requested data.");
        });
        if (this.multipleContributionsDatasource !== null) {
          this.hideCancelInvoiceButton = false;
          this.hideCreateInvoiceButton = false;
        }
  }
  
  onSubmitContributionList() {
    if (this.multipleContributionsDatasource.length < 1) {
      this.toastr.error('Can not submit empty list', 'No members contribution available');
      return;
    }
    // const data = {
    //   employerNumber:this.authService.getUserDetails().linkId,
    //   invoices: this.securityService.decryptString(sessionStorage.getItem(AppSettings.invoiceDetailsKey))
    // };
    // sessionStorage.removeItem(AppSettings.invoiceStorageKey);
    // this.router.navigate(['/multiple-contribution-invoice']);
    sessionStorage.setItem(AppSettings.contributionInvoiceIdKey,  this.securityService.encryptString(this.invoiceID));
    this.router.navigate(['/bill-items']);
  }
  
  onAddContribution() {
    this.invoiceListStorageService.setIsMultipleContribution(true);
    this.router.navigate(['/customers/employers'], { queryParams: { multi: true },  queryParamsHandling: 'merge' });
  }

  addContributionToExistingInvoice() {
    this.router.navigate(['/customers/employers'], { queryParams: { addContribution: true, id: this.invoiceID },  queryParamsHandling: 'merge' });
  }
  onCancelContributionList() {
      const result = confirm(
        'Are you sure you want to delete this invoice?. \n Click Yes to delete, click No to cancel delete operation.',
        'Delete an invoice'
      );

      result.then(dialogResult => {
        if (dialogResult) {
          const data = {
            requestType: 'INVOICE_DELETE',
            invoiceRef: this.invoiceID
          };

          this.spinner.show();
          this.utilities.postServiceCall(data, 'portal/request').subscribe(res => {
            const serverResp = res;
            this.spinner.hide();
            if (serverResp.code == 2000) {
              sessionStorage.removeItem(AppSettings.invoiceStorageKey);
              sessionStorage.removeItem(AppSettings.invoiceDetailsKey);
              sessionStorage.removeItem(AppSettings.customerUserGroup);
              this.multipleContributionsDatasource = [];
              this.hideCancelInvoiceButton = true;
              this.hideCreateInvoiceButton = true;
              this.toastr.success(serverResp.message, 'Invoice Delete');
              this.router.navigate(['/customers/employers']);
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

  DeleteContributionDetails(e) {
    const result = confirm(
      'Are you sure, you want to delete this contribution?',
      'Delete Contribution'
    );
    result.then(dialogResult => {
      if (dialogResult) {
        const data = {
          contributionId: e.id
        };
        this.spinner.show();
        this.utilities.postServiceCall(data, 'contributions/delete').subscribe( res => {
          this.spinner.hide();
          const serverRes = res;
          if (serverRes.code == 2000) {
            this.toastr.success('Contibution month deleted.');
            this.multipleContributionsDatasource = serverRes.data.invoiceContributions;
            if (this.multipleContributionsDatasource.length == 1) {
              this.hideDeleteOnOneInvoiceEntry = true;
            }
            const invoiceLocalData = this.securityService.decryptString(sessionStorage.getItem(AppSettings.invoiceDetailsKey));
            const localData = {
              contributionInvoice: invoiceLocalData.contributionInvoice,
              invoicePenalties: invoiceLocalData.invoicePenalties
            };
            for (const iterator of this.invoicePenalties) {
              if (e.contributionMonth == iterator.contributionMonth) {
                this.deleteInvoice(iterator.penaltyInvoiceId, 0);
                const  index = localData.invoicePenalties.findIndex(el => el.invoiceID == iterator.penaltyInvoiceId);
                localData.invoicePenalties.splice(index, 1);
              }
            }
            sessionStorage.setItem(AppSettings.invoiceDetailsKey,  this.securityService.encryptString(localData));
            if (this.multipleContributionsDatasource.length < 1) {
              // add logic to clear invoice
              this.deleteInvoice(this.invoiceID, 1);
              sessionStorage.removeItem(AppSettings.invoiceStorageKey);
              sessionStorage.removeItem(AppSettings.invoiceDetailsKey);
            }
          } else {
            this.toastr.error('Cannot delete contribution at this time.', serverRes.message);
          }
        }, error => {
          this.spinner.hide();
          this.toastr.error('Cannot delete contribution at this time.', error);
        });
      }
    });
  }

  deleteInvoice(invoiceID, flag) {
    const data = {
      invoiceID
    };
    this.utilities.postServiceCall(data, 'invoices/delete').subscribe( res => {
      const serverRes = res;
      if (serverRes.code == 2000) {
        // add logic to clear invoice
        if (flag === 1) {
          sessionStorage.removeItem(AppSettings.invoiceStorageKey);
          sessionStorage.removeItem(AppSettings.invoiceDetailsKey);
          this.multipleContributionsDatasource = [];
          this.hideCancelInvoiceButton = true;
          this.hideCreateInvoiceButton = true;
        }
      }
    }, error => {
    });
  }

  async onItemDeleting(e) {
    const d = $.Deferred();
    confirm(
        'Do you really want to delete the item ?',
        'Delete Contribution'
      ).done( value => {
        if (value) {
          this.multipleContributionsDatasource = this.multipleContributionsDatasource
                .splice(this.multipleContributionsDatasource.findIndex( el => el.invoiceId != e.itemData.invoiceId), 1);

          sessionStorage.removeItem(AppSettings.invoiceStorageKey);
          sessionStorage.setItem(AppSettings.invoiceStorageKey, this.securityService.encryptString(this.multipleContributionsDatasource));
        }
        d.resolve(!value);
      }).fail(d.reject);
    e.cancel = d.promise();
  }
  onItemHold(e) {
    this.toastr.info('Long press detected');
  }

  onContextItemClick(e) {
    if (e.itemData.hasOwnProperty('invoiceId')) {
      this.invoiceID = e.itemData.invoiceId;
    }
    if (e.itemData.hasOwnProperty('text')) {
       if (e.itemIndex == 0) {
        this.router.navigate(['/invoice/view/contributions'],
        { queryParams: { editingMode: 1, key: this.invoiceID },  queryParamsHandling: 'merge' });
       } else if (e.itemIndex == 1) {
        this.router.navigate(['/invoice/view/contributions'],
        { queryParams: { editingMode: 2, key: this.invoiceID },  queryParamsHandling: 'merge' });
       } else if (e.itemIndex == 2) {
        this.router.navigate(['/invoice/view/contributions'],
        { queryParams: { editingMode: 3, key: this.invoiceID },  queryParamsHandling: 'merge' });
       }
    }
}

contributionInWords(rowData) {
    if (rowData.contributionMonth == 1) {
      return 'January';
    } else if (rowData.contributionMonth == 2) {
      return 'February';
    } else if (rowData.contributionMonth == 3) {
      return 'March';
    } else if (rowData.contributionMonth == 4) {
      return 'April';
    } else if (rowData.contributionMonth == 5) {
      return 'May';
    } else if (rowData.contributionMonth == 6) {
      return 'June';
    } else if (rowData.contributionMonth == 7) {
      return 'July';
    } else if (rowData.contributionMonth == 8) {
      return 'August';
    } else if (rowData.contributionMonth == 9) {
      return 'September';
    } else if (rowData.contributionMonth == 10) {
      return 'October';
    } else if (rowData.contributionMonth == 11) {
      return 'November';
    } else if (rowData.contributionMonth == 12) {
      return 'December';
    }
}

viewContributionDetails(rowData) {
  this.router.navigate(['/invoice/view/contributions'],
  { queryParams: { contributionId: rowData.id },  queryParamsHandling: 'merge' });
}
}
