import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { confirm } from 'devextreme/ui/dialog';
import { AppSettings } from 'src/app/app-settings';

@Component({
  selector: 'app-generated-contributions',
  templateUrl: './generated-contributions.component.html',
  styleUrls: ['./generated-contributions.component.scss']
})
export class GeneratedContributionsComponent extends SharedClassComponent implements OnInit {
  title = 'Invoice Contribution Data';
  queryParam: any;
  months: any;
  allowAdding = false;
  allowUpdating = false;
  allowDeleting = false;
  contributionDataset = [];
  contributionDetails = [];
  contibutionId;
  contributionDataEdited = false;

  contributionUpdateEndPoint = 'contributions/update';

  contributionAddEndPoint = 'contributions/add';

  currrentEmployerNumber: any;
  // endpoints
  validateMemberNumberEndPoint = 'users/verify';

  updateContributionsEndPoint = 'contributions/update';
  addContributionsEndPoint = 'contributions/add';
  deleteContributionsEndPoint = 'contributions/delete';
  getContributionEndpointCall = 'contributions/id';

  contributionEntryTypeId;

  // form
  monthSelectorForm: FormGroup;
  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.currrentEmployerNumber = this.securityService.decryptString(sessionStorage.getItem(AppSettings.customerNumberKey));
    this.months = this.contributionService.getMonthsDataset();
    this.route.queryParams.subscribe((params) => {
      this.contibutionId = params.contributionId;
    });
    // Controls the datagrid height and max rows to display
    this.observerCall();
    this.spinner.show();
    const data = {
      contributionId: this.contibutionId
    };

    this.utilities.postServiceCall(data, this.getContributionEndpointCall).subscribe(res => {
      this.spinner.hide();
      const serverRes = res;
      if (serverRes.code == 2000) {
        this.contributionDetails = [{
          contributionYear: serverRes.data.contributionIDetails.contributionYear,
          contributionMonth: serverRes.data.contributionIDetails.contributionMonth,
          amountReceivable: serverRes.data.contributionIDetails.amountReceivable,
          dateCreated: serverRes.data.contributionIDetails.dateCreated,
          narration: serverRes.data.contributionIDetails.narration,
          contributionId: serverRes.data.contributionIDetails.id
        }];
        this.contributionEntryTypeId = serverRes.data.individualContributionInvoices[0].entryTypeID;
        this.contributionDataEdited = true;
        for (const iterator of serverRes.data.individualContributionInvoices) {
          this.contributionDataset.push({
            baseAmount: iterator.baseAmount,
            contributingPeriod: iterator.contributingPeriod,
            contributionInvoiceDetailId: iterator.contributionInvoiceDetailId,
            contributionMonth: iterator.contributionMonth,
            contributionYear: iterator.contributionYear,
            createdBy: iterator.createdBy,
            dateCreated: iterator.dateCreated,
            datePosted: iterator.datePosted,
            employerNumber: this.currrentEmployerNumber,
            entryTypeID: iterator.entryTypeID,
            employerID: this.currrentEmployerNumber,
            id: iterator.id,
            invoiceID: iterator.invoiceID,
            invoiceMultFlag: iterator.invoiceMultFlag,
            invoiceTrackNo: iterator.invoiceTrackNo,
            lastModified: iterator.lastModified,
            lastModifiedBy: iterator.lastModifiedBy,
            memberID: iterator.memberID,
            memberNames: iterator.memberNames,
            memberNumber: iterator.memberNumber,
            posted: iterator.posted,
            verified: iterator.verified,
            memberContribution: ((7 / 100) * iterator.baseAmount),
            employerContribution: ((13 / 100) * iterator.baseAmount),
            amountContributed: ((7 / 100) * iterator.baseAmount) + ((13 / 100) * iterator.baseAmount)
          });
        }
      } else {
        this.toastr.error(serverRes.message);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error('Please try again later', 'Request Failed');
    });


    this.currrentEmployerNumber = this.securityService.decryptString(sessionStorage.getItem(AppSettings.customerNumberKey));
    this.monthSelectorForm = new FormGroup({
      month: new FormControl(null, Validators.required)
    });
  }
  selectedChanged(e) {

  }

  updateInvoiceContribution() {

    const result = confirm(
      'Do you want to continue?.',
      'Update Contribution records'
    );
    result.then(dialogResult => {
      if (dialogResult) {

       let totalAmt = 0;
       const individualContribution = [];
       for (const el of this.contributionDataset) {
      totalAmt += el.amountContributed;
      individualContribution.push({
        memberId: el.memberID,
        memberNumber: el.memberNumber,
        memberNames: el.memberNames,
        memberSalary: +el.baseAmount.toFixed(2),
        memberContribution: +el.memberContribution.toFixed(2),
        employerContribution: +el.employerContribution.toFixed(2),
        amountContributed: +el.amountContributed.toFixed(2)
      });
    }
       const data = {
          contributionId: this.contributionDetails[0].contributionId,
          totalAmount: `${totalAmt}`,
          entryType: this.contributionEntryTypeId,
          narration: this.contributionDetails[0].narration,
          individualContribution
        };
       this.spinner.show();
       this.utilities.postServiceCall(data, this.contributionUpdateEndPoint).subscribe(res => {
          const serverResponse = res;
          this.spinner.hide();
          if (serverResponse.code == 2000) {
            this.contributionDataEdited = false;
            this.router.navigate(['invoice/contributions']);
            this.contributionDataset = [];
            this.toastr.success('Contribution details updated', serverResponse.message);
          } else {
            this.toastr.error(serverResponse.message);
          }
        }, error => {
           this.spinner.hide();
           this.toastr.error(`Error occured while processing the request ${error}`, 'Request Failed');
        });
      }
    });
  }

  discardChanges() {

    const result = confirm(
      'All modifications that have been done, will be discared.',
      'Discard Changes?'
    );
    result.then(dialogResult => {
      if (dialogResult) {
        this.contributionDataEdited = false;
        this.contributionDataset = [];
        this.router.navigate(['/invoice/contributions']);
      }
    });
  }

  // data grids colums & rows calculating

  //  DataGrid's row Calculations & Validations

   setEmployerNumber(rowData) {
      return this.currrentEmployerNumber;
  }

   calculateMemberContribution(rowData) {
    if (isNaN(rowData.baseAmount) && rowData.baseAmount !== undefined) {
      let num: any = rowData.baseAmount.toString();
      num = +num.replace(',', '');
      return ((7 / 100) * num);
    } else {
      return rowData.memberContribution;
    }
  }
  calculateEmployerContribution(rowData) {
    if (isNaN(rowData.baseAmount) && rowData.baseAmount !== undefined) {
      let num: any = rowData.baseAmount.toString();
      num = +num.replace(',', '');
      return ((13 / 100) * num);
    } else {
      return rowData.employerContribution;
    }
  }
  memberSalaryFilter(rowData) {
    if (isNaN(rowData.baseAmount) && rowData.baseAmount !== undefined) {
      let num: any = rowData.baseAmount.toString();
      num = +num.replace(',', '');
      return num;
    } else {
      return rowData.baseAmount;
    }
  }
  calculateAmountContributed(rowData) {
    if (isNaN(rowData.baseAmount) && rowData.baseAmount !== undefined) {
      let num: any = rowData.baseAmount.toString();
      num = +num.replace(',', '');
      // return num1 + num2;
      return (((7 / 100) * num + (13 / 100)) * num);
    } else {
      return rowData.amountContributed;
    }
  }

  validateMemberSalaryThreshold(e) {
    let num: any = e.value;
    num = +num.replace(',', '');
    return num >= 180000;
  }

  onMemberNumberValidation(e) {
    if (e.memberNumber) {
      e.promise = this.validateMemberNumber(
        e.newData.memberNumber,
        this.validateMemberNumberEndPoint
      ).subscribe(
        (result) => {
          // "result" is { errorText: "The Email address you entered already exists.", isValid: false }
          const serverRes = result;
          if (serverRes.code == 2000) {
            // e.errorText = serverRes.errorText;
            e.isValid = serverRes.isValid;
          } else {
            this.toastr.error(
              'Something went wrong while validating members number'
            );
          }
        },
        (error) =>
          this.toastr.error(
            'Something went wrong while validating members number'
          )
      );
    }
  }

  validateMemberNumber(memberNumber, endPoint) {
    const data = {
      memberNumber,
    };
    return this.utilities.postServiceCall(data, endPoint);
  }
  onRowInserting(e) {
    e.data.employerNumber = this.currrentEmployerNumber;
    e.data.contributionYear = this.contributionService.getContributionYear();
    e.data.contributionMonth = this.contributionService.getContributionMonth();
  }
  onRowInserted(e) {
    const baseSalary = e.data.baseAmount;
    // calculate member & employer contribution, as well as total amount contributed
    const memberContribution: number = ((7 / 100) * baseSalary);
    const employerContribution: number = ((13 / 100) * baseSalary);
    e.data.memberContribution = memberContribution;
    e.data.employerContribution = employerContribution;
    e.data.amountContributed = memberContribution + employerContribution;
    e.data.employerNumber = this.currrentEmployerNumber;
  }

  onRowUpdated(e) {
    const baseSalary = e.data.baseAmount;
    // calculate member & employer contribution, as well as total amount contributed
    const memberContribution: number = ((7 / 100) * baseSalary);
    const employerContribution: number = ((13 / 100) * baseSalary);
    e.data.memberContribution = memberContribution;
    e.data.employerContribution = employerContribution;
    e.data.amountContributed = memberContribution + employerContribution;
    e.data.employerNumber = this.currrentEmployerNumber;
  }
  onEditingStart(e) {
    e.data.employerNumber = this.currrentEmployerNumber;
  }


  customizeText(data) {
    return "Total Members: " + data.value;
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

}
