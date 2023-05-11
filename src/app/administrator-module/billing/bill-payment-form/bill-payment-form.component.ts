import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppSettings } from 'src/app/app-settings';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-bill-payment-form',
  templateUrl: './bill-payment-form.component.html',
  styleUrls: ['./bill-payment-form.component.scss']
})
export class BillPaymentFormComponent  extends SharedClassComponent implements OnInit {

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
  membersContributionRouterLink = '/contribution/upload';

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
  payerName: any;
  employerPhone: any;
  employerEmail: any;
  paymentType: any;
  invoiceDescription: any;
  invoiceCurrency: any;
  amountInWords = '';
  billExpireDate = '';
  invoiceBillItems = [];
  billCreationDate: any;
  now: any;
  currentYear = new Date().getFullYear();
  openInvoiceEditPopUp = false;
  contributionBatchData: any;
  isGeneratedContributionBatch = false;
  invoiceDataSource = {
      contributionInvoice: null,
      invoicePenalties: null
    };
  invoiceID = '';

 ID: any;
 DESCRIPTION: any;
 CURRENCY: any;
 AMOUNT: any;
 userGroup: any;
 hideViewControls = false;
 individualBillDescription: any;
 hideReceiptTemplate = true;
 fname =sessionStorage.getItem("fname")
 lname =sessionStorage.getItem("lname")

 billData = [];

 hidePrintBtn = true;


 employerName = null;

  clearanceDate = null;
  description = null;

  paymentOpt = null;
  currency = null;
  amount = null;
  receiptNumber = null;



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
  billID:any

  //billListDatasource = [];
  billAmount = null;
  amountDue = null;
  amountPaid = null;
  controlnumberFumis:any

  navReceipt = '';
  amountInWorlds = '';
  todayDate = new Date()
  printedDate:any

  response={
    CONTROL_NUMBER: '554050104106',
    AMOUNT : '10000',
    PAYER_NAME: 'CURRY-FLEX',
    CURRENCY: 'TZS',
    EXPIRE_DATE:'20-09-2030'
  }
  billItems: any;
  ngOnInit() {
     
    if (sessionStorage.getItem(AppSettings.billDetailsKey) === null || sessionStorage.getItem(AppSettings.billDetailsKey) === undefined) {
      this.toastr.error('No bill information.');
      return;
    }
    this.billData.push(JSON.parse(sessionStorage.getItem(AppSettings.billDetailsKey)));
    this.hideQrCode = false;
    this.qrCodeString = `{
      controlNumber:${this.billData[0].CONTROL_NUMBER},
      payerName:${this.billData[0].PAYER_NAME},
      totalAmount:${this.billData[0].AMOUNT},
      currency:${this.billData[0].CURRENCY},
      expireDate:${this.billData[0].EXPIRE_DATE}
    }`;
    this.controlNumber = this.billData[0].CONTROL_NUMBER;
    this.controlnumberFumis = this.billData[0].controlNo;
    this.billID = this.billData[0].id;
    //this.controlNumber = '554050104106';
    this.totalAmountContributed = this.billData[0].AMOUNT;
    this.billCreationDate = this.billData[0].CREATION_DATE;
    this.payerName = this.billData[0].PAYER_NAME;
    
    
    try {
      for(const iterator of this.billData[0].BILL_ITEMS) {
        this.invoiceBillItems.push({
          ID: iterator.BILL_ID,
          DESCRIPTION: iterator.DESCRIPTION,
          AMOUNT: iterator.AMOUNT
        });
      };
    } catch (error) {
      this.invoiceBillItems.push({
        ID: this.billData[0].ID,
        DESCRIPTION: this.billData[0].DESCRIPTION,
        AMOUNT: this.billData[0].AMOUNT
      });
    }
     
    this.invoiceCurrency = this.billData[0].CURRENCY;
    this.payableBanks = 'CRDB, PBZ, NMB';
    if(this.controlNumber)
    {
      this.getBillDetails()
    }
    else{
      this.getBillDetailsfUMIS()
    }
    
   
    this.hidePrintBtn = false;
   
  }

  changeFormat(data:any){
    //this.printedDate = new Date(data).getFullYear() + "-"+  ("0"+(new Date(data).getMonth()+1)).slice(-2) + "-" +("0" + new Date(data).getDate()).slice(-2);
    this.printedDate =("0" + new Date(data).getDate()).slice(-2)+"-"+("0"+(new Date(data).getMonth()+1)).slice(-2) + "-" +new Date(data).getFullYear();
   
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
    sessionStorage.removeItem(AppSettings.billDetailsKey)
  }

  printInvoiceReceiptNew() {
    this.isInvoicePrinted = true;
    let popUpWindow;
    const innerContents = document.getElementById('print-container2').innerHTML;
    popUpWindow = window.open('', '_blank', 'scrollbars=no, menubar=no, toolbar=no, location=no, status=no, titlebar=no');
    // popUpWindow.document.open();
    popUpWindow.document.write(`<html lang="en">
           <head>
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
            line-height: 30;
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
            .pagebreak { page-break-before: always; } /* page-break-after works, as well */
        }
           </style>
           </head>
           <body onload="window.print()">${innerContents}</html>`);
    popUpWindow.document.close();
    sessionStorage.removeItem(AppSettings.billDetailsKey)
  }


  getBillDetails() {
   
    this.spinner.show();
    console.log(this.controlNumber)

    const data={
      requestType:"BILLS_GET",
      billRef: this.controlNumber
    }
     
    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
     // console.log(res)
      if (res.code == 2000) {
      
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
        this.billItems = res.data.billItems
      } else {
        this.toastr.error(res.message);
        
      }
      this.spinner.hide();
    }, error => {
      this.toastr.error('Something went wrong please try again.');
      this.spinner.hide();
    });

 
   // console.log(this.invoiceBillItems)

    //console.log(this.invoiceBillItems)
    // setTimeout(() => {
    //   this.printBillForm();
    //   this.spinner.hide();
    // }, 3000);
  }

  getBillDetailsfUMIS() {
   
    this.spinner.show();
    console.log(this.controlNumber)

    const data={
      requestType:"BILLS_GET",
      billRef: this.controlnumberFumis
    }
     
    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
     // console.log(res)
      if (res.code == 2000) {
      
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
        this.billItems = res.data.billItems
      } else {
        this.toastr.error(res.message);
        
      }
      this.spinner.hide();
    }, error => {
      this.toastr.error('Something went wrong please try again.');
      this.spinner.hide();
    });

 
   // console.log(this.invoiceBillItems)

    //console.log(this.invoiceBillItems)
    // setTimeout(() => {
    //   this.printBillForm();
    //   this.spinner.hide();
    // }, 3000);
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

}
