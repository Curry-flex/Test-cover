import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from '../shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-fumis-invoice',
  templateUrl: './fumis-invoice.component.html',
  styleUrls: ['./fumis-invoice.component.scss']
})
export class FumisInvoiceComponent extends SharedClassComponent implements OnInit {

  title = 'FUMIS Bills';

  contributionDatasource = [];
  penaltyDatasource = [];
  fumisDetails: any;

  searchForm: FormGroup;
  currentYear = new Date().getFullYear();
  now = new Date();

  controlNumber = '';
  amount = '';
  currency = '';
  customerNumber = '';
  payerName = '';
  hideQrCode = true;
  qrCodeString = '';
  invoiceBillItems = [];
  hideInvoiceSheet = true;

  showGenerateControls = false;
  showPrintControls = false;

  ngOnInit() {
    this.searchForm = new FormGroup({
      requestType: new FormControl('FUMIS_INVOICE_GET'),
      invoiceRef: new FormControl(null, Validators.compose([Validators.required]))
    });
  }

  fetchDetails() {
    if (this.searchForm.invalid) {
      this.toastr.error('Please enter Invoice ID or Invoice Number to proceed');
      return;
    }
    this.searchForm.get('requestType').patchValue('FUMIS_INVOICE_GET');
    this.utilities.baseApiPostServiceCall(this.searchForm.value).subscribe(res => {
      this.spinner.hide();
      if (res.code == 2000) {
        this.toastr.success(res.message);
        try {
          this.fumisDetails = res.data.invoice;
          this.contributionDatasource = res.data.contributions;
          this.penaltyDatasource = res.data.penalties;
          this.showGenerateControls = true;
          this.showPrintControls = false;
        } catch (error) {
          console.log(error);
          this.showGenerateControls = false;
          this.showPrintControls = false;
          this.toastr.error('Could not extract result set, an exception occured.', error);
        }
      } else {
        this.toastr.error(res.message);
        this.showGenerateControls = false;
        this.showPrintControls = false;
      }
    }, err => {
      this.showGenerateControls = false;
      this.showPrintControls = false;
      console.log(err);
      this.toastr.error('Something went wrong while processing the request.', 'Please try again');
    });
  }

  seal() {
    if (this.searchForm.invalid) {
      this.toastr.error('Please enter Invoice ID or Invoice Number to proceed');
      return;
    }

    const dt = {
      requestType:'BILL_CREATE_FUMIS',
      invoiceRef: this.searchForm.get('invoiceRef')
    }

    this.utilities.baseApiPostServiceCall(dt).subscribe(res => {
      this.spinner.hide();
      if (res.code == 2000) {
        this.toastr.success(res.message);
        this.showGenerateControls = false;
        try {
          this.controlNumber = res.data.controlNo;
          this.amount = res.data.billAmount;
          this.currency = res.data.cuurency || 'TZS';
          this.customerNumber = res.data.customerNo;
          this.payerName = res.data.payerName;
          this.qrCodeString = `{
            "controlNumber": "${res.data.controlNo}",
            "payerName": "${res.data.payerName}",
            "totalAmount":" ${res.data.billAmount}",
            "currency": "${res.data.cuurency || 'TZS'}",
            "expireDate": "${res.data.billExDate}",
            "paymentType": "${res.data.pmtOption}"
            }`;
          this.hideQrCode = false;
          this.invoiceBillItems = res.data.billItems;
          this.hideInvoiceSheet = false;
          this.printInvoiceReceipt();
          this.showPrintControls = true;
        } catch (error) {
          console.log(error);
          this.toastr.error('Could not extract result set, an exception occured.', error);
        }
      } else {
        this.showGenerateControls = true;
        this.showPrintControls = false;
        this.toastr.error(res.message);
      }
    }, err => {
      console.log(err);
      this.showGenerateControls = true;
      this.showPrintControls = false;
      this.toastr.error('Something went wrong while processing the request.', 'Please try again');
    });
  }

  printInvoiceReceipt() {
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

}
