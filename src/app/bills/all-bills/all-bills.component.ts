import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';
import { confirm } from 'devextreme/ui/dialog';

@Component({
  selector: 'app-all-bills',
  templateUrl: './all-bills.component.html',
  styleUrls: ['./all-bills.component.scss']
})
export class AllBillsComponent extends SharedClassComponent implements OnInit {

  /* START VARIABLE DECLARATION */
  INVOICE_NO = null;
  CONTROL_NUMBER = null;
  CREATION_DATE = null;
  AMOUNT = null;
  CURRENCY = null;
  CUSTOMER_NO = null;
  PAYER_NAME = null;
  STATUS = null;
  CLEARANCE_DATE = null;
  PSP_REFERENCE_ID = null;
  NAV_RECEIPT = null;
  CURRENT_DATA: any;
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
  now = new Date();
  currentYear = new Date().getFullYear();
  navReceipt = '';

  hideViewControls = false;
  isPenaltyInvoice = false;
  ID: any;
  DESCRIPTION: any;
  individualBillDescription: any;
  contributedMembers = [];
  invoiceID = '';
  callEndpoint = 'portal/request';

  /* END VARIABLE DECALARATION */
  showPaymentDetailsDialog = false;
  datasource = [];
  USERGROUP = this.authService.getUserDetails().userGroup;
  hideDeleteButton = true;
  title = 'All Bills';
  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.observerCall();
    this.getAllInvoicePaymentRecords();
    this.appInfo.setTitle(this.title);
    // if (this.USERGROUP == 'COMPLIANCE_MANAGER' || this.USERGROUP == 'COMPLIANCE_OFFICER' || this.USERGROUP == 'SUPER_ADMIN') {
    //   this.hideDeleteButton = false;
    // } else {
    //   this.hideDeleteButton = true;
    // }
  }

  resetData() {
    this.INVOICE_NO = null;
    this.CONTROL_NUMBER = null;
    this.CREATION_DATE = null;
    this.AMOUNT = null;
    this.CURRENCY = null;
    this.CUSTOMER_NO = null;
    this.PAYER_NAME = null;
    this.STATUS = null;
    this.CLEARANCE_DATE = null;
    this.PSP_REFERENCE_ID = null;
    this.NAV_RECEIPT = null;
    this.CURRENT_DATA = null;
  }
// fdfdfdfd
  getAllInvoicePaymentRecords() {
    const data = {
      requestType: 'BILLS_LIST',
      systemId: '',
      scope: 'ALL',
    };
    this.spinner.show();
    this.utilities.postServiceCall(data, this.portalRequestEndPoint).subscribe(res => {
      if (res.code == 2000) {
        this.datasource = [];
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

  previewBillDetails(e) {
    this.CURRENT_DATA = e.data;
    this.INVOICE_NO = e.data.INVOICE_NO ;
    this.CONTROL_NUMBER = e.data.CONTROL_NUMBER ;
    this.CREATION_DATE = e.data.CREATION_DATE ;
    this.AMOUNT = e.data.AMOUNT ;
    this.CURRENCY = e.data.CURRENCY ;
    this.CUSTOMER_NO = e.data.CUSTOMER_NO ;
    this.PAYER_NAME = e.data.PAYER_NAME ;
    this.STATUS = e.data.STATUS ;
    this.CLEARANCE_DATE = e.data.CLEARANCE_DATE ;
    this.PSP_REFERENCE_ID = e.data.PSP_REFERENCE_ID ;
    this.NAV_RECEIPT = e.data.NAV_RECEIPT ;
    this.showPaymentDetailsDialog = true;
  }

  onToolBarPreparing(e) {
    e.toolbarOptions.items.unshift( {
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'refresh',
        type: 'default',
        onClick: this.getAllInvoicePaymentRecords.bind(this)
      }
    });
  }

  onControlNumberDelete(e) {

    if (this.USERGROUP == 'COMPLIANCE_MANAGER' || this.USERGROUP == 'COMPLIANCE_OFFICER' || this.USERGROUP == 'SUPER_ADMIN') {
      const result = confirm(`Are you sure, you want to delete generated control number ${e.CONTROL_NUMBER} associated with an invoice number (${e.INVOICE_NO}) ?`, 'Delete generated control Number');
      result.then(dialogResult => {
        if (dialogResult) {
          const data = {
            requestType: 'BILL_DELETE',
            controlNo: e.CONTROL_NUMBER
          };
          this.spinner.show();
          this.utilities.postServiceCall(data, this.backEndRequestEndPoint).subscribe(res => {
            if (res.code == 2000) {
                this.getAllInvoicePaymentRecords()
            } else {
              this.toastr.error(res.message);
            }
            // this.spinner.hide();
          }, error => {
            this.toastr.error('Something went wrong please try again');
            this.spinner.hide();
          });
        }
      });
    } else {
      this.toastr.error('Only COMPLIANCE MANAGER or COMPLIANCE OFFICER or SUPER ADMIN can delete generated bills');
    }
  }

  printPaymentReceipt(e) {
    this.spinner.show();
    this.employerName = e.PAYER_NAME;
    this.invoiceNumber = e.INVOICE_NO;
    this.clearanceDate = e.CLEARANCE_DATE;
    this.description = e.DESCRIPTION;
    this.employerNumber = e.CUSTOMER_NO;
    this.controlNumber = e.CONTROL_NUMBER;
    this.paymentOpt = e.PAYMENT_OPTION;
    this.currency = e.CURRENCY;
    this.amount = e.AMOUNT;
    this.receiptNumber = e.ID;
    this.navReceipt = e.NAV_RECEIPT;
    this.invoiceID = e.INVOICE_ID;
    setTimeout(()=> {
      this.printInvoiceReceipt();
      this.spinner.hide();
    }, 3000);

  }

  printBillInvoice(e) {
    this.spinner.show();
    this.invoiceBillItems = [];
    this.controlNumber = e.CONTROL_NUMBER;
    this.totalAmountContributed = e.AMOUNT;
    this.invoiceCurrency = e.CURRENCY;
    this.invoiceDate = e.CREATION_DATE;
    this.employerNumber = e.CUSTOMER_NO;
    this.employerName = e.PAYER_NAME;
    this.qrCodeString = `{"controlNumber":${e.CONTROL_NUMBER},"totalAmount":${e.AMOUNT},"currency":${e.CURRENCY}}`;
    this.hideQrCode = false;
    this.payableBanks = 'PBZ, CRDB, NMB';

    if (e.CATEGORY_CODE === 'FUMIS_PENALTIES') {
      this.isPenaltyInvoice = true;
      this.AMOUNT = e.AMOUNT;
      this.ID = e.ID;
      this.DESCRIPTION = e.DESCRIPTION;
      this.CURRENCY = e.CURRENCY;
    }
    this.individualBillDescription = e.DESCRIPTION;
    this.invoiceBillItems.push({
       ID: e.ID,
       DESCRIPTION: e.DESCRIPTION,
       individualBillDescription: e.DESCRIPTION,
       invoiceCurrency: e.CURRENCY,
       AMOUNT: e.AMOUNT,
       CURRENCY: e.CURRENCY
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


  generatePdf(e){
    this.spinner.show();
    this.invoiceBillItems = [];
    this.controlNumber = e.CONTROL_NUMBER;
    this.totalAmountContributed = e.AMOUNT;
    this.invoiceCurrency = e.CURRENCY;
    this.invoiceDate = e.CREATION_DATE;
    this.employerNumber = e.CUSTOMER_NO;
    this.employerName = e.PAYER_NAME;
    this.qrCodeString = `{"controlNumber":${e.CONTROL_NUMBER},"totalAmount":${e.AMOUNT},"currency":${e.CURRENCY}}`;
    this.hideQrCode = false;
    this.payableBanks = 'PBZ, CRDB, NMB';

    if (e.CATEGORY_CODE === 'FUMIS_PENALTIES') {
      this.isPenaltyInvoice = true;
      this.AMOUNT = e.AMOUNT;
      this.ID = e.ID;
      this.DESCRIPTION = e.DESCRIPTION;
      this.CURRENCY = e.CURRENCY;
    }
    this.individualBillDescription = e.DESCRIPTION;
    this.invoiceBillItems.push({
       ID: e.ID,
       DESCRIPTION: e.DESCRIPTION,
       individualBillDescription: e.DESCRIPTION,
       invoiceCurrency: e.CURRENCY,
       AMOUNT: e.AMOUNT,
       CURRENCY: e.CURRENCY
    });
    setTimeout(() => {
      this.printBillForm();
      this.spinner.hide();
    }, 3000);
  }


getMembersList(e, flag) {
    this.employerName = e.PAYER_NAME;
    this.invoiceNumber = e.INVOICE_NO;
    this.clearanceDate = e.CLEARANCE_DATE;
    this.description = e.DESCRIPTION;
    this.employerNumber = e.CUSTOMER_NO;
    this.controlNumber = e.CONTROL_NUMBER;
    this.paymentOpt = e.PAYMENT_OPTION;
    this.currency = e.CURRENCY;
    this.amount = e.AMOUNT;
    this.receiptNumber = e.ID;
    this.navReceipt = e.NAV_RECEIPT;
    this.invoiceID = e.INVOICE_ID;

    this.spinner.show();

    let requestType = '';

    if(flag == 1) {
      requestType = 'INVOICE_INDIVIDUAL_CONTRIBUTIONS';
    } else {
      requestType = 'INVOICE_INDIVIDUAL_CONTRIBUTIONS_INVOICES';
    }

    const data = {
      requestType,
      invoiceRef: e.INVOICE_ID
     };


    this.utilities.postServiceCall(data, this.callEndpoint).subscribe(res => {
      const serverResponse = res;
      const data = {};
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
        this.spinner.hide();
      }
    }, error => {
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

