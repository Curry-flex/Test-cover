import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-contro-number-bill-details',
  templateUrl: './contro-number-bill-details.component.html',
  styleUrls: ['./contro-number-bill-details.component.scss']
})
export class ControNumberBillDetailsComponent extends SharedClassComponent implements OnInit {

  searchFieldsForm: FormGroup;
  billDetails: any;
  title = 'Get Bill Details By Control number';
  now = new Date();

  apiEndpoint = 'employer/bills';
  InvoicePaymentsDataSource = [];
  hidePrintMembers = false;

  employerName = null;
  invoiceNumber = null;
  clearanceDate = null;
  description = null;
  employerNumber = null;
  controlNumber = null;
  paymentOpt = null;
  currency = null;
  amount = null;
  receiptNumber = null;
  hideReceiptTemplate = true;

  // invoice items
  billDescription = '';
  totalAmountPaid: any;
  payableBanks = '';
  totalAmountContributed: any;
  employerPhone: any;
  employerEmail: any;
  paymentType: any;
  invoiceDescription: any;
  invoiceCurrency: any;
  billExpireDate = '';
  invoiceDate: any;
  qrCodeString = '';
  hideQrCode = true;
  invoiceBillItems = [];
  userGroup: any;
  currentYear = new Date().getFullYear();
  navReceipt = '';
  amountInWorlds = '';

  hideViewControls = false;
  isPenaltyInvoice = false;
  AMOUNT: any;
  ID: any;
  DESCRIPTION: any;
  CURRENCY: any;
  individualBillDescription: any;
  contributedMembers = [];
  invoiceID = '';
  callEndpoint = 'portal/request';

  id = null;
  // amount = null;
  billDesc = null;
  billExDate = null;
  catCode = null;
  catName = null;
  controlNo = null;
  createdBy = null;
  creationDate = null;
  cuurency = null;
  deptCode = null;
  deptName = null;
  payerEmail = null;
  payerMobile = null;
  payerName = null;
  pmtOption = null;
  payerTel = null;
  invoiceNo = null;
  // clearanceDate = null;
  customerNo = null;
  zmControlNo = null;
  zmExpDate = null;
  zmCreationDate = null;
  cleared = null;
  crAcc = null;
  pmtMethod = null;
  psp = null;
  pspRef = null;
  // navReceipt = null;
  amountWords = null;

  billListDatasource = [];
  billAmount = null;
  amountDue = null;
  amountPaid = null;

  ngOnInit() {

    this.searchFieldsForm = new FormGroup({
      requestType: new FormControl('BILLS_GET', Validators.compose([])),
      billRef: new FormControl(null, Validators.compose([Validators.compose([Validators.required])]))
    });
  }

  onSearchRecordHandler() {
    this.spinner.show();

    if (this.searchFieldsForm.invalid) {
      this.toastr.error('Please enter control number or bill Id.');
      return;
    }

    this.utilities.baseApiPostServiceCall(this.searchFieldsForm.value).subscribe(res => {
      if (res.code == 2000) {
        this.billDetails = res.data;
        this.id = res.data.id;
        // this.amount = res.data.amount;
        this.billAmount = res.data.billAmount;
        this.amountDue = res.data.amountDue;
        this.amountPaid = res.data.amountPaid;
        this.billDesc = res.data.billDesc;
        this.billExDate = res.data.billExDate;
        this.catCode = res.data.catCode;
        this.catName = res.data.catName;
        this.controlNo = res.data.controlNo;
        this.createdBy = res.data.createdBy;
        this.creationDate = res.data.creationDate;
        this.cuurency = res.data.cuurency;
        this.deptCode = res.data.deptCode;
        this.deptName = res.data.deptName;
        this.payerEmail = res.data.payerEmail;
        this.payerMobile = res.data.payerMobile;
        this.payerName = res.data.payerName;
        this.pmtOption = res.data.pmtOption;
        this.payerTel = res.data.payerTel;
        this.invoiceNo = res.data.invoiceNo;
        this.clearanceDate = res.data.clearanceDate;
        this.customerNo = res.data.customerNo;
        this.zmControlNo = res.data.zmControlNo;
        this.zmExpDate = res.data.zmExpDate;
        this.zmCreationDate = res.data.zmCreationDate;
        this.cleared = res.data.cleared;
        this.crAcc = res.data.crAcc;
        this.pmtMethod = res.data.pmtMethod;
        this.psp = res.data.psp;
        this.pspRef = res.data.pspRef;
        this.navReceipt = res.data.navReceipt;
        this.amountWords = res.data.amountWords;
      } else {
        this.toastr.error(res.message);
        this.clear();
      }
      this.spinner.hide();
    }, error => {
      this.toastr.error('Something went wrong please try again.');
      this.spinner.hide();
    });
  }
clear() {
this.id = null;
this.amount = null;
this.billDesc = null;
this.billExDate = null;
this.catCode = null;
this.catName = null;
this.controlNo = null;
this.createdBy = null;
this.creationDate = null;
this.cuurency = null;
this.deptCode = null;
this.deptName = null;
this.payerEmail = null;
this.payerMobile = null;
this.payerName = null;
this.pmtOption = null;
this.payerTel = null;
this.invoiceNo = null;
this.clearanceDate = null;
this.customerNo = null;
this.zmControlNo = null;
this.zmExpDate = null;
this.zmCreationDate = null;
this.cleared = null;
this.crAcc = null;
this.pmtMethod = null;
this.psp = null;
this.pspRef = null;
this.navReceipt = null;
this.amountWords = null;
this.billAmount = null;
this.amountDue = null;
this.amountPaid = null;
  }



  printPaymentReceipt(e) {
    this.spinner.show();
    this.employerName = e.payerName;
    this.invoiceNumber = e.invoiceNo;
    this.clearanceDate = e.creationDate;
    this.description = e.billDesc;
    this.employerNumber = e.customerNo;
    this.controlNumber = e.controlNo;
    this.paymentOpt = 'EXACT';
    this.currency = e.currency;
    this.amount = e.amount;
    this.receiptNumber = e.id;
    this.navReceipt = e.navReceipt;
    this.invoiceID = e.invoiceNo;
    this.amountInWorlds = e.amountWords;
    setTimeout(()=> {
      this.printInvoiceReceipt();
      this.spinner.hide();
    }, 3000);
  }


  printBillInvoice(e) {
    this.spinner.show();
    this.invoiceBillItems = [];
    this.controlNumber = e.controlNo;
    this.totalAmountContributed = e.amount;
    this.invoiceCurrency = e.currency;
    this.invoiceDate = e.creationDate;
    this.employerNumber = this.authService.getUserDetails().linkId;
    this.employerName = this.authService.getUserDetails().accountName;
    this.qrCodeString = `{"controlNumber":${e.controlNo};"totalAmount":${e.amount};"currency":${e.currency};}`;
    this.hideQrCode = false;
    this.payableBanks = 'PBZ, CRDB, NMB';

    // if (e.CATEGORY_CODE === 'FUMIS_PENALTIES') {
    //   this.isPenaltyInvoice = true;
    //   this.AMOUNT = e.amout;
    //   this.ID = e.id;
    //   this.DESCRIPTION = e.billDesc;
    //   this.CURRENCY = e.currency;
    // }
    this.individualBillDescription = e.billDesc;
    this.invoiceBillItems.push({
       ID: e.ID,
       DESCRIPTION: e.billDesc,
       individualBillDescription: e.billDesc,
       invoiceCurrency: e.currency,
       AMOUNT: e.amount,
       CURRENCY: e.currency
    });
    setTimeout(() => {
      this.printBillForm();
      this.spinner.hide();
    }, 3000);
  }


  printBillForm() {
    let popUpWindow;
    this.hideReceiptTemplate = false;
    const innerContents = document.getElementById('print-container3').innerHTML;
    this.hideReceiptTemplate = false;
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

  printInvoiceReceipt() {
    let popUpWindow;
    this.hideReceiptTemplate = false;
    const innerContents = document.getElementById('print-container2').innerHTML;
    this.hideReceiptTemplate = false;
    popUpWindow = window.open('', '_blank', 'scrollbars=no, menubar=no, toolbar=no, location=no, status=no, titlebar=no');
    // popUpWindow.document.open();
    popUpWindow.document.write(`<html lang="en">
           <head>
           <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
           <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">
           <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
           <style>
          p span, .stamp span{
            display: block;
          }
          .respect, .recieved-from, .amount-words{
            margin-right: 30px;
          }
          .reciever-name{
            border: none;
            border-bottom: 1px dashed black;
            display:block;
            width: 100%;
          }
          .cover{
            position: absolute;
            top: 11%;
            left: 35%;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0.05;
          }
          .app{
            background-color: lightgoldenrodyellow;
          }
          h1, p{
            color: #0c713dbf;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
          }
          .group{
            display: flex;
            justify-content: space-between;
          }
          .full_table{
            width: 100%;
          }
          .paid{
              /* z-index: 90000; */
              position: absolute;
              top: 12%;
              /* right: 2%; */
              left: 43%;
              width: 280px;
              height: 280p;
              background-repeat: no-repeat;
              background-position: center;
              opacity: .13;
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
            width: 100%;
            float: none;
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
    this.hideReceiptTemplate = true;
  }

  getMembersList(e, flag) {
    this.employerName = e.payerName;
    this.invoiceNumber = e.invoiceNo;
    this.clearanceDate = e.clearanceDate;
    this.description = e.billDesc;
    this.employerNumber = e.customerNo;
    this.controlNumber = e.controlNo;
    this.paymentOpt = 'EXACT';
    this.currency = e.cuurency;
    this.amount = e.amount;
    this.receiptNumber = e.id;
    this.navReceipt = e.navReceipt;
    this.invoiceID = e.invoiceNo;

    this.spinner.show();

    let requestType = '';

    if(flag == 1) {
      requestType = 'INVOICE_INDIVIDUAL_CONTRIBUTIONS';
    } else {
      requestType = 'INVOICE_INDIVIDUAL_CONTRIBUTIONS_INVOICES';
    }

    const data = {
      requestType,
      invoiceRef: e.invoiceNo
     };


    this.utilities.postServiceCall(data, this.callEndpoint).subscribe(res => {
      const serverResponse = res;
      let counter = 0;
      this.contributedMembers = [];
      if (serverResponse.code == 2000) {
        for (const el of serverResponse.data.contributedMembers) {
          if(flag == 1) {
            this.contributedMembers.push({
              counter: counter + 1,
              memberNumber: el.memberNumber,
              memberNames: `${el.firstName} ${el.middleName} ${el.surName}`,
              contributionYear: `${el.contributingPeriod}`.substring(0, 4),
              contributionMonth: this.contributionInWords(`${el.contributingPeriod}`.substring(4)),
              amountContributed: el.amountContributed,
              memberSalary: el.baseAmount
            });
          } else {
            this.contributedMembers.push({
              counter: counter + 1,
              memberNumber: el.memberNumber,
              memberNames: el.memberNames,
              contributionYear: `${el.contributingPeriod}`.substring(0, 4),
              contributionMonth: this.contributionInWords(`${el.contributingPeriod}`.substring(4)),
              amountContributed: el.amountContributed,
              memberSalary: el.baseAmount
            });
          }
         counter++;
        }
        setTimeout(() => {
          this.printMembersList(flag);
          this.spinner.hide();
        }, 3000);
        // this.hidePrintMembersButton = false;
      } else {
        this.toastr.error(serverResponse.message);
        // this.logServerErrors(this.router.url, serverResponse.message, requestType);
        this.spinner.hide();
      }
    }, error => {
      // this.logServerErrors(this.router.url, error, requestType);
      this.spinner.hide();
    });
   }

contributionInWords(month) {
    if (month == 1 || month == '01') {
      return 'January';
    } else if (month == 2 || month == '02') {
      return 'February';
    } else if (month == 3 || month == '03') {
      return 'March';
    } else if (month == 4 || month == '04') {
      return 'April';
    } else if (month == 5 || month == '05') {
      return 'May';
    } else if (month == 6 || month == '06') {
      return 'June';
    } else if (month == 7 || month == '07') {
      return 'July';
    } else if (month == 8 || month == '08') {
      return 'August';
    } else if (month == 9 || month == '09') {
      return 'September';
    } else if (month == 10 || month == 10) {
      return 'October';
    } else if (month == 11 || month == 11) {
      return 'November';
    } else if (month == 12 || month == 12) {
      return 'December';
    }
}

printMembersList(flag) {
  let popUpWindow;

  const innerContents = flag === 1 ? document.getElementById('print-container4').innerHTML : document.getElementById('print-container5').innerHTML;
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

}
