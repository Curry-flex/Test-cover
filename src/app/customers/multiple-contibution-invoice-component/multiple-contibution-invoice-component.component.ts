import { Component, OnInit } from '@angular/core';
import { confirm } from 'devextreme/ui/dialog';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';
import { AppSettings } from 'src/app/app-settings';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-multiple-contibution-invoice',
  templateUrl: './multiple-contibution-invoice-component.component.html',
  styleUrls: ['./multiple-contibution-invoice-component.component.scss']
})
export class MultipleContibutionInvoiceComponent extends SharedClassComponent implements OnInit {

  contributedMembers = [];
  hideMembersContributionList = true;

  invoiceForm: FormGroup;
  qrCodeString = '';
  apiCallEndpoint = 'fumis_bill/create';
  hidePrintInvoiceButton = true;
  hidePrintMembersButton = true;
  hideGenerateControlNumberButton = true;
  hideEditInvoiceButton = true;
  hideCancelInvoiceButton = true;
  hideNoContributionMadeForInvoiceBanner =  true;
  hideInvoiceSheet = true;
  hideQrCode = true;
  membersContributionRouterLink = '/customers/employers';

  isInvoiceCreated = true;
  isInvoicePostedForPayment = false;
  isInvoicePrinted = false;
  isPenaltyInvoice = false;

  // invoice items
  controlNumber: any;
  billDescription = '';
  totalAmountPaid: any;
  payableBanks = '';
  invoiceNumber: any;
  totalAmountContributed: any;
  employerNumber: any;
  employerName: any;
  employerPhone: any;
  employerEmail: any;
  paymentType: any;
  invoiceDescription: any;
  invoiceCurrency: any;
  amountInWords = '';
  billExpireDate = '';
  invoiceBillItems = [];
  now: any;
  currentYear = new Date().getFullYear();
  openInvoiceEditPopUp = false;
  contributionBatchData: any;
  isGeneratedContributionBatch = false;
  invoiceDataSource = {
      contributionInvoice: null,
      invoicePenalties: null
    };
  // for penalty invoices

  invoiceID = '';

 ID: any;
 DESCRIPTION: any;
 CURRENCY: any;
 AMOUNT: any;
 userGroup: any;
 hideViewControls = false;
 individualBillDescription: any;
  billItems: any;
  invoiceNo: any;
  payerName: any;
  payerMobile: any;
  zmControlNo: any;
  createdBy: any;
  creationDate: any;
  printedDate: string;
  todayDate = new Date()
  fname =sessionStorage.getItem("fname")
  lname =sessionStorage.getItem("lname")
  BILLAMOUNT: any;
  ngOnInit() {
    this.changeFormat(this.todayDate)
    this.userGroup = sessionStorage.getItem(AppSettings.customerUserGroup);
    if (`${this.userGroup}`.match('INDIVIDUAL_CONTRIBUTOR')) {
      this.hideViewControls = true;
    }
    this.employerNumber = this.securityService.decryptString(sessionStorage.getItem(AppSettings.customerNumberKey));
    this.employerName = this.securityService.decryptString(sessionStorage.getItem(AppSettings.customerName));
    this.now = new Date();
    this.invoiceForm = new FormGroup({
      employerName: new FormControl(null, Validators.compose([Validators.required])),
      employerPhone: new FormControl(null, Validators.compose([])),
      employerEmail: new FormControl(null, Validators.compose([Validators.required, Validators.email]))
    });
    try {
      const data = this.securityService.decryptString(sessionStorage.getItem(AppSettings.invoiceBillsItems));
      if (data === null || data === undefined) {
        this.hideNoContributionMadeForInvoiceBanner = false;
        this.isInvoiceCreated = false;
        this.toastr.error('No contributions have been added');
      } else {
        this.employerNumber = this.securityService.decryptString(sessionStorage.getItem(AppSettings.customerNumberKey));;
        this.employerName = this.securityService.decryptString(sessionStorage.getItem(AppSettings.customerName));
        this.employerPhone = '';
        this.employerEmail = '';
        this.onControlNumberGeneration();
        this.hideInvoiceSheet = false;
        this.hideGenerateControlNumberButton = true;
        this.hideEditInvoiceButton = false;
        this.hideCancelInvoiceButton = false;
        this.hideNoContributionMadeForInvoiceBanner = true;
      }
    } catch (error) {
      this.hideNoContributionMadeForInvoiceBanner = false;
      this.isInvoiceCreated = false;
      this.toastr.error('No contributions have been added');
    }

  }


  changeFormat(data:any){
    //this.printedDate = new Date(data).getFullYear() + "-"+  ("0"+(new Date(data).getMonth()+1)).slice(-2) + "-" +("0" + new Date(data).getDate()).slice(-2);
    this.printedDate =("0" + new Date(data).getDate()).slice(-2)+"-"+("0"+(new Date(data).getMonth()+1)).slice(-2) + "-" +new Date(data).getFullYear();
   
  }


  // this is not used
  generateControlNumber() {
    const result = confirm(
      // tslint:disable-next-line: max-line-length
      'You\'re about to generate the invoice\'s control number, no further invoice\'s modifications are allowed after control number is generated and you can not cancel the invoice afterwards!',
      'Generate invoice\'s Control number'
    );
    const invoices = this.securityService.decryptString(sessionStorage.getItem(AppSettings.invoiceBillsItems));

    const data = {
      employerNumber: this.securityService.decryptString(sessionStorage.getItem(AppSettings.customerNumberKey)),
      invoices
    };
    // const data = {
    //   requestType: 'EMPLOYER_BILL_GENERATE',
    //   invoiceId: invoices[0]
    // };
    result.then(dialogResult => {
      if (dialogResult) {
      this.spinner.show();

      this.utilities.postServiceCall(data, this.apiCallEndpoint).subscribe(res => {
      //console.log(res)
      this.spinner.hide();
      const serverResponse = res;
      if (serverResponse.code == 2000) {
        this.now = new Date();
        this.isInvoicePostedForPayment = true;
        // tslint:disable-next-line: max-line-length
        this.qrCodeString = `{"controlNumber":${serverResponse.data.controlNumber};"totalAmount":${serverResponse.data.totalAmount};"currency":${serverResponse.data.currency};}`;
        this.controlNumber = serverResponse.data.controlNumber;
        this.billDescription = serverResponse.data.billDescription;
        this.payableBanks = serverResponse.data.banks;
        this.individualBillDescription = serverResponse.data.
        this.invoiceBillItems = serverResponse.data.billItems;
        this.totalAmountContributed = serverResponse.data.totalAmount;
        this.invoiceCurrency = serverResponse.data.currency;
        this.amountInWords = serverResponse.data.totalAmountWords;
        this.billExpireDate = serverResponse.data.billExpireDate;
       
        this.hideQrCode = false;
        this.hideEditInvoiceButton = true;
        this.hideCancelInvoiceButton = true;
        this.hidePrintInvoiceButton = false;
        this.hideGenerateControlNumberButton = true;
        sessionStorage.removeItem(AppSettings.invoiceStorageKey);
        sessionStorage.removeItem(AppSettings.invoiceDetailsKey);
        sessionStorage.removeItem(AppSettings.batchContributionInvoiceResultDataKey);
        sessionStorage.removeItem(AppSettings.contributionBatchMonthKey);
        sessionStorage.removeItem(AppSettings.invoiceBillsItems);
      } else {
        this.toastr.error(serverResponse.message, 'Request Failed');
      }
    }, error => {
      this.toastr.error(error, 'Request Failed');
      this.spinner.hide();
    });
      }
    });
  }

  openPopUpDialog() {
    this.invoiceForm.get('employerName').patchValue(this.employerName);
    this.invoiceForm.get('employerPhone').patchValue(this.employerPhone);
    this.invoiceForm.get('employerEmail').patchValue(this.employerEmail);
    this.openInvoiceEditPopUp = true;
  }
  closePopUp() {
    this.openInvoiceEditPopUp = false;
  }
  onEditInvoice() {
    if (this.invoiceForm.invalid) {
      this.toastr.error('Please fill out all form data', 'Alert');
      return;
    }
    this.employerName = this.invoiceForm.get('employerName').value;
    this.employerPhone = this.invoiceForm.get('employerPhone').value;
    this.employerEmail = this.invoiceForm.get('employerEmail').value;
    this.openInvoiceEditPopUp = false;
    }
  cancelInvoice() {
    const result = confirm(
      'Are You sure You want to cancel this invoice ?',
      'Invoice Contribution'
    );
    result.then(dialogResult => {
      if (dialogResult) {
        sessionStorage.removeItem(AppSettings.invoiceStorageKey);
        sessionStorage.removeItem(AppSettings.batchContributionInvoiceResultDataKey);
        sessionStorage.removeItem(AppSettings.contributionBatchMonthKey);
        sessionStorage.removeItem(AppSettings.contributionInvoiceIdKey);
        this.toastr.info('Invoice cancelled');
        this.router.navigate(['/home']);
      }
    });
  }

  getMembersList() {
   const data = {
    invoiceID: this.invoiceID
   };
   this.utilities.postServiceCall(data, 'invoices/contributions').subscribe(res => {
     const serverResponse = res;
     if (serverResponse.code == 2000) {
       for (const el of serverResponse.data.individualContributions) {
        this.contributedMembers.push({
          memberNumber: el.memberNumber,
          memberNames: el.memberNames,
          contributionYear: el.contributionYear,
          contributionMonth: this.contributionInWords(el.contributionMonth),
          amountContributed: el.amountContributed,
          memberSalary: el.baseAmount
        });
       }
       this.hidePrintMembersButton = false;
     }
   }, error => {
   });
  }

  printMembersList() {
    let popUpWindow;
    const innerContents = document.getElementById('print-container3').innerHTML;
    popUpWindow = window.open('', '_blank', 'scrollbars=no, menubar=no, toolbar=no, location=no, status=no, titlebar=no');
    // popUpWindow.document.open();
    popUpWindow.document.write(`<html lang="en">
           <head>
           <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
           <style>
           body{
            font-size: 14px;
            line-height: 1.42857143;
            color: #333;
          }
          .logo__block{
          border-bottom: 1px dotted rgb(0 172 238);
          }
          .logo__block p, .footer, p {
            color: rgb(0 172 238);
          }
          .invoice{
            background-color: rgba(0, 0, 0, 0.055);
            padding: 2rem;
            width: fit-content;
            height: 100vh;
          }
          .invoice__body{
            display: flex;
          }
          .invoice__body table tr th{
            background: rgb(0 172 238);
            color:white;
            text-align:left;
            vertical-align:center;
          }
          .invoice__body table tr {
            background-color: rgba(136 ,136 ,136, .1);
            border: 1px solid #ddd;
            padding: .35em;
          }
          .logo__block, .footer{
              text-align: center;
          }
          .full_table{
            width: 100%;
          }
          table tbody tr td{
          padding: .5rem;
          }

          @media print {

          @page {
            size: A4;
            margin: 0mm;
          }

          html, body {
            width: 1024px;
          }

          body {
            margin: 0 auto;
            line-height: 1em;
            word-spacing:2px;
            letter-spacing:0.2px;
            /* font: 14px "Times New Roman", Times, serif; */
            font-size: 17px;
            /* background:rgba(0, 0, 0, 0.055); */
            color:black;
            width: 100%;
            float: none;
          }
          table { page-break-inside:auto }
          tr    { page-break-inside:avoid; page-break-after:auto }
          thead { display:table-header-group }
          tfoot { display:table-footer-group }
          .invoice__body table tr th{
            padding: 5px;
          }
          .footer{
            position: absolute;
            bottom: 10px;
            width: 100%;
            text-align: center;
          }
          .invoice{
            background-color: transparent;
          }

          /* avoid page-breaks inside a listingContainer*/
          .listingContainer{
            page-break-inside: avoid;
          }
          h1 {
              font: 28px "Times New Roman", Times, serif;
            }

            h2 {
              font: 24px "Times New Roman", Times, serif;
            }

            h3 {
              font: 20px "Times New Roman", Times, serif;
            }

            /* Improve colour contrast of links */
            a:link, a:visited {
              color: #781351
            }

            /* URL */
            a:link, a:visited {
              background: transparent;
              color:#333;
              text-decoration:none;
            }

            a[href]:after {
              content: "" !important;
            }
            a[href^="http://"] {
              color:#000;
            }

            #header {
              height:75px;
              font-size: 24pt;
              color:black
            }
          }

           </style>
           </head>
           <body onload="window.print()">${innerContents}</html>`);
    popUpWindow.document.close();
  }

  printInvoiceReceipt() {
    this.isInvoicePrinted = true;
    let popUpWindow;
    const innerContents = document.getElementById('print-container2').innerHTML;
    popUpWindow = window.open('', '_blank', 'scrollbars=no, menubar=no, toolbar=no, location=no, status=no, titlebar=no');
    // popUpWindow.document.open();
    popUpWindow.document.write(`<html lang="en">
           <head>
           <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
           <style>
           body{
            font-size: 14px;
            line-height: 1.42857143;
            color: #333;
          }
          .space{
            display: flex;
            justify-content: space-between;
            border: 1px dotted #4d88bb;
            padding: 1rem 0;
          }
          .logo__block{
          /* border-bottom: 1px dotted #4d88bb; */
          border-bottom: 1px dotted rgb(0 172 238);
          }
          .logo__block p, .footer, p {
            /* color: #4d88bb; */
            color: rgb(0 172 238);
          }
          .invoice__head__child_contacts{
            margin: 19px;
          }
          .invoice_wrapper {
            position: absolute;
          }
          .invoice_wrapper, .invoice{
            /*background-color: rgba(0, 0, 0, 0.055);*/
            padding: 2rem;
            width: fit-content;
            height: 100vh;
          }
          .invoice__head,
          .invoice__how_to_pay{
            display: flex;
            justify-content: space-between;
          }
          .invoice__body{
            display: flex;
            /* justify-content: center; */
          }
          .invoice__body table tr th{
            background: rgb(0 172 238);
            color:white;
            text-align:left;
            vertical-align:center;
          }
          .invoice__body table tr {
            background-color: rgba(136 ,136 ,136, .1);
            border: 1px solid #ddd;
            padding: .35em;
          }
          .logo__block, .footer{
              text-align: center;
          }
          .full_table{
            width: 100%;
          }
          .divide {
            position: relative;
            min-height: 80%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          /* .watermark {
          position:fixed;
          font-size: 88px;
          bottom: 0;
          opacity:0.5;
          z-index:99;
          color: #35313126;
          text-align: center;
          } */
          table tbody tr td{
          padding: .5rem;
          }

          @media print {

          @page {
            size: A4;
            margin: 0mm;
          }

          html, body {
            width: 1024px;
          }

          body {
            margin: 0 auto;
            line-height: 1em;
            word-spacing:2px;
            letter-spacing:0.2px;
            /* font: 14px "Times New Roman", Times, serif; */
            font-size: 17px;
            background:rgba(0, 0, 0, 0.1);
            color:black;
            width: 100%;
            float: none;
          }
          .invoice__body table tr th{
            padding: 5px;
          }
          .footer{
            position: absolute;
            bottom: 10px;
            width: 100%;
            text-align: center;
          }
          /* avoid page-breaks inside a listingContainer*/
          .listingContainer{
            page-break-inside: avoid;
          }
          h1 {
              font: 28px "Times New Roman", Times, serif;
            }

            h2 {
              font: 24px "Times New Roman", Times, serif;
            }

            h3 {
              font: 20px "Times New Roman", Times, serif;
            }

            /* Improve colour contrast of links */
            a:link, a:visited {
              color: #781351
            }

            /* URL */
            a:link, a:visited {
              background: transparent;
              color:#333;
              text-decoration:none;
            }

            a[href]:after {
              content: "" !important;
            }
            a[href^="http://"] {
              color:#000;
            }

            #header {
              height:75px;
              font-size: 24pt;
              color:black
            }
          }

           </style>
           </head>
           <body onload="window.print()">${innerContents}</html>`);
    popUpWindow.document.close();
  }

  printInvoiceReceiptNew() {
    this.isInvoicePrinted = true;
    let popUpWindow;
    const innerContents = document.getElementById('print-container2').innerHTML;
    popUpWindow = window.open('', '_blank', 'scrollbars=no, menubar=no, toolbar=no, location=no, status=no, titlebar=no');
    // popUpWindow.document.open();
    popUpWindow.document.write(`<html lang="en">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous"><!-- JavaScript Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8" crossorigin="anonymous"></script>
    <style>
    hr {
     border:none;
     border-top:1px dashed #555;
     color:#fff;
     background-color:#fff;
     height:1px;
   }
   body{
     display: flex;
     align-items: center;
     justify-content: center;
     color: #222;
     font-size: 15px;
     line-height: 1.75;
     padding: 0.5em 2em;
   }
   div.main{
     width: 210mm;
     /*box-shadow: 0 0 3px 3px #777;*/
   }
   .tbtxt tr td:nth-child(2){
     padding-left: 1em;
   }
   .tbtxt tr td:nth-child(1){
     color: #000;
     font-weight: 500;
   }
   .tbdtails tr td:nth-child(3){
     float: right;
   }
   .heading{
     margin-top: 1em;
     font-weight: bold;
   }
   table.tbdtails {
     width: 100%;
   }
   table.tbdtails tr:last-child{
     background: #f4f4f7;
     font-weight: 500;
   }
   table td, table td * {
     vertical-align: top;
   }
   table.tbmnos{
     font-size: 0.8em;
   }
 
   table.tbmnos tr td{
     width: 33%;
   }
   @media print {
     .pagebreak { page-break-before: always; } 
   }
    </style>
    </head>
           <body onload="window.print()">${innerContents}</html>`);
    popUpWindow.document.close();
  }
  // new changes for api
  onControlNumberGeneration() {
    const invoices = this.securityService.decryptString(sessionStorage.getItem(AppSettings.invoiceBillsItems));
    let data = {};
    if (`${this.userGroup}`.match('INDIVIDUAL_CONTRIBUTOR')) {
      data = {
        requestType: 'INDIVIDUAL_CONTRIBUTOR_BILL_GENERATE',
        invoiceId: invoices[0].invoiceId
      };
    }

    if (`${this.userGroup}`.match('EMPLOYER')) {
      data = {
        requestType: 'EMPLOYER_BILL_GENERATE',
        invoiceId: invoices[0].invoiceId
      };
    }

    this.invoiceID = invoices[0].invoiceId;
    this.spinner.show();

    this.utilities.postServiceCall(data, 'portal/request').subscribe(res => {
        const serverResponse = res;
        console.log(res)
        if (serverResponse.code == 2000) {
        this.now = new Date();
        this.isInvoicePostedForPayment = true;
        // tslint:disable-next-line: max-line-length
        this.qrCodeString = `{
          "controlNumber": "${serverResponse.data.CONTROL_NUMBER}",
          "payerName": "${this.employerName}",
          "totalAmount": "${serverResponse.data.AMOUNT}",
          "currency": "${serverResponse.data.CURRENCY}",
          "expireDate": "${serverResponse.data.EXPIRE_DATE}",
          "paymentType": "${serverResponse.data.PAYMENT_OPTION}"
          }`;
        this.controlNumber = serverResponse.data.CONTROL_NUMBER;
        this.billDescription = serverResponse.data.CATEGORY_NAME;
        this.payableBanks = 'CRDB, PBZ, NMB';
        this.individualBillDescription = serverResponse.data.DESCRIPTION;
        this.invoiceBillItems = serverResponse.data.BILL_ITEMS;
        this.totalAmountContributed = serverResponse.data.AMOUNT;
        this.invoiceCurrency = serverResponse.data.CURRENCY;
        this.amountInWords = serverResponse.data.AMOUNT_WORDS;
        this.billExpireDate = serverResponse.data.EXPIRE_DATE;

        this.billItems = serverResponse.data.BILL_ITEMS
        this.invoiceNo = serverResponse.data.INVOICE_NO
        this.payerName =serverResponse.data.PAYER_NAME
        this.payerMobile = serverResponse.data.MOBILE_NO
        this.zmControlNo = serverResponse.data.ZM_CONTROL_NO
        this.createdBy = serverResponse.data.CREATED_BY
        this.creationDate = serverResponse.data.CREATION_DATE;
        this.BILLAMOUNT = serverResponse.data.AMOUNT

        this.hideQrCode = false;
        this.hideEditInvoiceButton = true;
        this.hideCancelInvoiceButton = true;
        this.hidePrintInvoiceButton = false;
        this.hideGenerateControlNumberButton = true;
        if (serverResponse.data.CATEGORY_CODE == 'FUMIS_PENALTIES') {
          this.ID = serverResponse.data.ID;
          this.DESCRIPTION = serverResponse.data.DESCRIPTION;
          this.CURRENCY = serverResponse.data.CURRENCY;
          this.AMOUNT = serverResponse.data.AMOUNT;
          this.isPenaltyInvoice = true;
        }
        this.getMembersList();
        sessionStorage.removeItem(AppSettings.invoiceStorageKey);
        sessionStorage.removeItem(AppSettings.invoiceDetailsKey);
        sessionStorage.removeItem(AppSettings.batchContributionInvoiceResultDataKey);
        sessionStorage.removeItem(AppSettings.contributionBatchMonthKey);
        sessionStorage.removeItem(AppSettings.invoiceBillsItems);
        } else {
          this.toastr.error(serverResponse.message);
          this.hideGenerateControlNumberButton = false;
        }
        this.spinner.hide();
      }, error => {
        // this.toastr.error(error, 'API error');
        this.hideGenerateControlNumberButton = false;
        this.spinner.hide();
      });
  }


  contributionInWords(month) {
    if (month === 1) {
      return 'January';
    } else if (month === 2) {
      return 'February';
    } else if (month === 3) {
      return 'March';
    } else if (month === 4) {
      return 'April';
    } else if (month === 5) {
      return 'May';
    } else if (month === 6) {
      return 'June';
    } else if (month === 7) {
      return 'July';
    } else if (month === 8) {
      return 'August';
    } else if (month === 9) {
      return 'September';
    } else if (month === 10) {
      return 'October';
    } else if (month === 11) {
      return 'November';
    } else if (month === 12) {
      return 'December';
    }
}


}
