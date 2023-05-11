import { PercentPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';
import { BillDescription,
  BillInfo, Collections,
  ComplaintsWithPercent,
  PaymentsByPspBanks,
  TotalInvoicesPerType} from 'src/app/shared/services/plotting.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: [ './home.component.scss' ]
})

export class HomeComponent extends SharedClassComponent implements OnInit {

  title = 'Employers Registration Report (Daily, Weekly, Monthly, Yearly)';
  modelName = 'backend/request';
  requestType = 'REPORT_EMPLOYERS_REG';

  yearlyReport = [];
  monthlyReport = [];
  weeklyReport = [];
  dailyReport = [];

  USERGROUP = this.authService.getUserDetails().userGroup;
  hideSensitiveData = true;
  dataSource: ComplaintsWithPercent[];
  pipe: any = new PercentPipe('en-US');
  paymentCollectionBanks: PaymentsByPspBanks[];

  paymentCollectionMNO: PaymentsByPspBanks[];

  collectionDataSource: Collections[];

  currentYear = new Date().getFullYear();

  billsInfo: BillInfo[];
  billTypes: BillDescription[];
  invTypeDatasource: TotalInvoicesPerType[];
  paidInvoicesDatasource: TotalInvoicesPerType[];
  all_bills = [];
  totalCollectionsByBanks = 0;
  totalCollectionsByMno = 0.00;
  totalCollectionsByPos = 0.00;
  totalCollectionsByBanksCRDB = 0;
  totalCollectionsByBanksPBZ = 0;
  totalCollectionsByBanksNMB = 0;

//   tab_paneldata:any = [{
//     ID: 1,
//     icon: 'fa fa-check-circle',
//     name: 'Paid Invoices',
// }, {
//     ID: 2,
//     icon: 'fa fa-retweet',
//     name: 'Pending Payments',
// }, {
//     ID: 3,
//     icon: 'fa fa-sort-amount-desc',
//     name: 'All Invoices',
// }];


tab_paneldata: any = [{
  ID: 1,
  name: 'Daily',
}, {
  ID: 2,
  name: 'Weekly',
}, {
  ID: 3,
  name: 'Monthly',
}, {
ID: 4,
name: 'Yearly',
}];

  paymentsDataSource = [];
  pendingPayments = [];
  generatedBills = [];

  paymentDatasourceByBanks = [{
    psp: 'CRDB',
    val: 0
  }, {
    psp: 'NMB',
    val: 0
  }, {
    psp: 'PBZ',
    val: 0
  }];

  collectionData= [{
    month: 'Jan',
    banks: 0,
  }, {
    month: 'Feb',
    banks: 0,
  }, {
    month: 'Mar',
    banks: 0,
  }, {
    month: 'Apr',
    banks: 0,
  }, {
    month: 'May',
    banks: 0,
  },
  {
    month: 'Jun',
    banks: 0,
  },
  {
    month: 'Jul',
    banks: 0,
  },
  {
    month: 'Aug',
    banks: 0,
  },
  {
    month: 'Sep',
    banks: 0,
  },
  {
    month: 'Oct',
    banks: 0,
  },
  {
    month: 'Nov',
    banks: 0,
  },
  {
    month: 'Dec',
    banks: 0,
  }
  ];

  userRoles = ['COMPLIANCE_MANAGER', 'COMPLIANCE_OFFICER', 'SUPER_ADMIN', 'ACCOUNTS_MANAGER', 'ACCOUNTS_OFFICER', 'GENERAL_MANAGER', 'MD']

  paymentSummaryForm: FormGroup;

  current = new Date().getFullYear();

  years: any;

  totalAmountCollectedYearly = 0;
  totalBillCountPerYear = 0;
  banksYealyCollectionDatasource = [];


  crdbMonthlyCollectionDatasource = [];
  nmbMonthlyCollectionDatasource = [];
  pbzMonthlyCollectionDatasource = [];


  ngOnInit() {
    this.paymentSummaryForm = new FormGroup({
      requestType: new FormControl('PSP_COLLECTION_SUMMARY', Validators.compose([])),
      year: new FormControl(this.current, Validators.compose([]))
    });
    this.years = this.contributionService.getYears();
    this.currentRoute = `${this.router.url}`.replace('/', '');
    if(this.userRoles.includes(this.USERGROUP)) {
      this.hideSensitiveData = false;
      this.paidInvoicesDatasource = this.plottingService.getPaidInvoices();
      this.invTypeDatasource = this.plottingService.getInvoices();
      this.billTypes = this.plottingService.getBillTypes();
      this.dataSource = this.plottingService.getComplaintsData();
      this.paymentCollectionBanks = this.plottingService.getPaymentByBanks();

      // this.getAllInvoicePaymentRecords();
      this.onSearchRecordHandler();
      this.getPaymentReport();
      this.paymentCollectionMNO = [{
        psp: 'TIGO',
        val: 0
      }, {
        psp: 'AIRTEL',
        val: 0
      }, {
        psp: 'ZANTEL',
        val: 0
      }];
    } else {
      this.hideSensitiveData = true;
      this.fetchReports();
    }

  }

  getPaymentReport() {

    this.spinner.show();
    this.utilities.baseApiPostServiceCall(this.paymentSummaryForm.value).subscribe(res => {
      if (res.code == 2000) {
         this.collectionData = res.data.generalMonthlySummary;
         this.totalAmountCollectedYearly = 0;
         this.totalBillCountPerYear = 0;
         this.banksYealyCollectionDatasource = [];
         this.crdbMonthlyCollectionDatasource = [];
         this.nmbMonthlyCollectionDatasource = [];
         this.pbzMonthlyCollectionDatasource = [];

         for (const iterator of res.data.pspYearlySummary) {
          this.banksYealyCollectionDatasource.push({
            psp: iterator.psp,
            billsCount: iterator.billsCount,
            amount: iterator.amount
          });
          this.totalBillCountPerYear += iterator.billsCount;
          this.totalAmountCollectedYearly += iterator.amount;
         }

         for (const iterator of res.data.pspMonthlySummary) {
           if (iterator.psp == 'CRDB') {
            this.crdbMonthlyCollectionDatasource = iterator.summary;
           }
           if (iterator.psp == 'NMB') {
            this.nmbMonthlyCollectionDatasource = iterator.summary;
           }
           if (iterator.psp == 'PBZ') {
            this.pbzMonthlyCollectionDatasource = iterator.summary;
           }
         }

      } else {
        this.toastr.error(res.message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error('Failed to load payment collection report, kindly click refresh button');
    });
  }

  onSearchRecordHandler() {
    const data = {
      "requestType": "BILLS_LIST",
      "date": "",
      "systemId": "",
      "memberNo": "",
      "employerNo": "",
      "controlNo": "",
      "invoiceNo": "",
      "scope": "CONTRIBUTIONS"
  }

    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
      if (res.code == 2000) {
        for (const iterator of res.data) {
          if (iterator.cleared == 1) {
            this.paymentsDataSource.push(iterator);
          } else {
            this.pendingPayments.push(iterator);
          }
        }
      } else {
        this.toastr.error(res.message);
      }
      this.spinner.hide();
    }, error => {
      this.toastr.error('Something went wrong please try again.');
      this.spinner.hide();
    });
  }

  onContributionYearChanged(e) {
    this.paymentSummaryForm.get('year').patchValue(e.value);
    this.current = e.value;
    this.getPaymentReport();
  }

  fetchReports() {
    const data = {
      requestType: this.requestType
    };
    this.spinner.show();
    this.utilities.postServiceCall(data, this.modelName).subscribe(
      response => {
        this.yearlyReport = [];
        this.monthlyReport = [];
        this.weeklyReport = [];
        this.dailyReport = [];
        if (response.code == 2000) {
          this.yearlyReport = response.data.yearlyReport;
          this.monthlyReport = response.data.monthlyReport;
          this.weeklyReport = response.data.weeklyReport;
          this.dailyReport = response.data.dailyReport;
        } else {
          this.toastr.error(response.message);
        }
        this.spinner.hide();
      },
      error => {
        this.toastr.error('Error Occured while processing the request, Error ->' + JSON.stringify(error));
        this.spinner.hide();
      }
    );
  }

  onPointClick(e) {
    e.target.select();
}

  customizeTooltip = (info: any) => {
    return {
        html: '<div><div class=\'tooltip-header\'>' +
            info.argumentText + '</div>' +
            '<div class=\'tooltip-body\'><div class=\'series-name\'>' +
            info.points[0].seriesName +
            ': </div><div class=\'value-text\'>' +
            info.points[0].valueText +
            '</div><div class=\'series-name\'>' +
            info.points[1].seriesName +
            ': </div><div class=\'value-text\'>' +
            info.points[1].valueText +
            '% </div></div></div>'
    };
}

customizeTooltip2 = (arg: any) => {
  return {
      text: this.plottingService.formatCurrency(arg.valueText) + ' - ' + this.pipe.transform(arg.percent, '1.2-2')
  };
}

customizeLabelText = (info: any) => {
    return info.valueText + '%';
}

pointClickHandler(e) {
  this.toggleVisibility(e.target);
}

legendClickHandler(e) {
  const arg = e.target;
  const item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];

  this.toggleVisibility(item);
}

toggleVisibility(item) {
  if (item.isVisible()) {
      item.hide();
  } else {
      item.show();
  }
}

getAllInvoicePaymentRecords() {
  const data = {
    requestType: 'BILLS_LIST',
    systemId: ''
  };
  let paidBillCounter = 0;
  let paidPending = 0;
  this.spinner.show();
  this.utilities.postServiceCall(data, this.portalRequestEndPoint).subscribe(res => {
    if (res.code == 2000) {
      this.paymentsDataSource = [];
      this.generatedBills = [];
      this.pendingPayments = [];
      this.billsInfo = [];

      this.totalCollectionsByBanks = 0;
      this.totalCollectionsByBanksCRDB = 0;
      this.totalCollectionsByBanksPBZ = 0;
      this.totalCollectionsByBanksNMB = 0;
      let totalJan = 0;
      let totalFeb = 0;
      let totalMar = 0;
      let totalApr = 0;
      let totalMay = 0;
      let totalJun = 0;
      let totalJul = 0;
      let totalAug = 0;
      let totalSep = 0;
      let totalOct = 0;
      let totalNov = 0;
      let totalDec = 0;
      for (const iterator of res.data) {
        if(new Date(iterator.CREATION_DATE).getFullYear() == new Date().getFullYear()) {
          for (let index = 0; index < 12; index++) {
            if (new Date(iterator.CREATION_DATE).getMonth() == index) {
              iterator.STATUS == 1 ? paidBillCounter++ : paidPending++;
              this.billsInfo.push(
                {
                  month: this.monthInWords(index+1),
                  paid: paidBillCounter,
                  pending: paidPending,
                  defected: 0
                }
              );

              if ( iterator.STATUS == 1) {
                  if (this.collectionData[index].month.match(this.monthInWords(index+1))) {
                      this.collectionData[index].banks += +iterator.AMOUNT;
                  }

                  if ('Jan'.match(this.monthInWords(index+1))) {
                    totalJan += +iterator.AMOUNT;
                  }
                  if ('Feb'.match(this.monthInWords(index+1))) {
                    totalFeb += +iterator.AMOUNT;
                  }
                  if ('Mar'.match(this.monthInWords(index+1))) {
                    totalMar+= +iterator.AMOUNT;
                  }
                  if ('Apr'.match(this.monthInWords(index+1))) {
                    totalApr += +iterator.AMOUNT;
                  }
                  if ('May'.match(this.monthInWords(index+1))) {
                    totalMay += +iterator.AMOUNT;
                  }
                  if ('Jun'.match(this.monthInWords(index+1))) {
                    totalJun += +iterator.AMOUNT;
                  }
                  if ('Jul'.match(this.monthInWords(index+1))) {
                    totalJul += +iterator.AMOUNT;
                  }
                  if ('Aug'.match(this.monthInWords(index+1))) {
                    totalAug += +iterator.AMOUNT;
                  }
                  if ('Sep'.match(this.monthInWords(index+1))) {
                    totalSep += +iterator.AMOUNT;
                  }
                  if ('Oct'.match(this.monthInWords(index+1))) {
                    totalOct += +iterator.AMOUNT;
                  }
                  if ('Nov'.match(this.monthInWords(index+1))) {
                    totalNov += +iterator.AMOUNT;
                  }
                  if ('Dec'.match(this.monthInWords(index+1))) {
                    totalDec += +iterator.AMOUNT;
                  }
            }
          }
        }
        }


        if (iterator.STATUS == 1) {
          this.totalCollectionsByBanks += +iterator.AMOUNT;
          this.paymentsDataSource.push({
            id: iterator.ID,
            date: iterator.CREATION_DATE,
            datePaid: iterator.CLEARANCE_DATE,
            controlNumber: iterator.CONTROL_NUMBER,
            psp_ref_num: iterator.PSP_REFERENCE_ID,
            amount: iterator.AMOUNT,
            currency: iterator.CURRENCY,
            status: iterator.STATUS,
            paymentType: iterator.PAYMENT_OPTION,
            description: iterator.DESCRIPTION,
            pspCode: iterator.PSP_CODE
          });

          if (`${iterator.PSP_CODE}`.toLocaleUpperCase().startsWith('CR')) {
            this.totalCollectionsByBanksCRDB += +iterator.AMOUNT;
          }

          if (`${iterator.PSP_CODE}`.toLocaleUpperCase().startsWith('NM')) {
            this.totalCollectionsByBanksNMB += +iterator.AMOUNT;
          }

          if (`${iterator.PSP_CODE}`.toLocaleUpperCase().startsWith('PB')) {
            this.totalCollectionsByBanksPBZ += +iterator.AMOUNT;
          }

        }

        if (iterator.STATUS == 0) {
          this.pendingPayments.push({
            id: iterator.ID,
            date: iterator.CREATION_DATE,
            controlNumber: iterator.CONTROL_NUMBER,
            psp_ref_num: iterator.PSP_REFERENCE_ID,
            amount: iterator.AMOUNT,
            currency: iterator.CURRENCY,
            status: iterator.STATUS,
            paymentType: iterator.PAYMENT_OPTION,
            description: iterator.DESCRIPTION,
            pspCode: iterator.PSP_CODE
          });
        }
        this.generatedBills.push({
          id: iterator.ID,
          date: iterator.CREATION_DATE,
          datePaid: iterator.CLEARANCE_DATE,
          controlNumber: iterator.CONTROL_NUMBER,
          psp_ref_num: iterator.PSP_REFERENCE_ID,
          amount: iterator.AMOUNT,
          currency: iterator.CURRENCY,
          status: iterator.STATUS,
          paymentType: iterator.PAYMENT_OPTION,
          description: iterator.DESCRIPTION,
          pspCode: iterator.PSP_CODE
        });
      }

      this.paymentDatasourceByBanks = [{
        psp: 'CRDB',
        val: this.totalCollectionsByBanksCRDB
      }, {
        psp: 'NMB',
        val: this.totalCollectionsByBanksNMB
      }, {
        psp: 'PBZ',
        val: this.totalCollectionsByBanksPBZ
      }];

      this.collectionData= [{
        month: 'Jan',
        banks: totalJan,
      }, {
        month: 'Feb',
        banks: totalFeb,
      }, {
        month: 'Mar',
        banks: totalMar,
      }, {
        month: 'Apr',
        banks: totalApr,
      }, {
        month: 'May',
        banks: totalMay,
      },
      {
        month: 'Jun',
        banks: totalJun,
      },
      {
        month: 'Jul',
        banks: totalJul,
      },
      {
        month: 'Aug',
        banks: totalAug,
      },
      {
        month: 'Sep',
        banks: totalSep,
      },
      {
        month: 'Oct',
        banks: totalOct,
      },
      {
        month: 'Nov',
        banks: totalNov,
      },
      {
        month: 'Dec',
        banks: totalDec,
      }
      ];

      this.collectionData = this.collectionData;

    } else {
      this.toastr.error(res.message);
    }
    this.spinner.hide();
  }, error => {
    this.toastr.error('Something went wrong please try again');
    this.spinner.hide();
  });
}


goToAnchor(anchor) {
  let x = document.querySelector(`#${anchor}`);
    if (x){
        x.scrollIntoView();
    }
}

onBillsToolBarPreparing(e) {
  e.toolbarOptions.items.unshift({
    location: 'after',
    widget: 'dxButton',
    options: {
      icon: 'refresh',
      type: 'default',
     onClick: this.getAllInvoicePaymentRecords.bind(this)
    }
  });
}

monthInWords(month) {
  if (month == '1') {
    return 'Jan';
  } else if (month == '2') {
    return 'Feb';
  } else if (month == '3') {
    return 'Mar';
  } else if (month == '4') {
    return 'Apr';
  } else if (month == '5') {
    return 'May';
  } else if (month == '6') {
    return 'Jun';
  } else if (month == '7') {
    return 'Jul';
  } else if (month == '8') {
    return 'Aug';
  } else if (month == '9') {
    return 'Sep';
  } else if (month == '10') {
    return 'Oct';
  } else if (month == '11') {
    return 'Nov';
  } else if (month == '12') {
    return 'Dec';
  }
 }

}
