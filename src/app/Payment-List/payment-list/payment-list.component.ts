import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent extends SharedClassComponent implements OnInit {

  biilsList:FormGroup
  responseData =[]
  title ="paymentList"
  controlNo:any
  description:any
  billAmount:any
  paidAmount:any
  paidAmountTotal:any
  amountDue:any
  currency:any
  creditAcc:any
  pspCode:any
  payRef:any
  payMethod:any
  receiptNo:any
  createdAt:any
  invoiceNo:any
  customerId:any
  payerName:any
  customerNo:any
  invoiceId:any
  zmControlNo:any
  amountPaidWords:any
  amountDueWords

  showReceiptDetails =false
  showPayementList =true
  //constructor() { }

  ngOnInit() {

    this.biilsList = new FormGroup({
     date: new FormControl('', Validators.compose([])),
     payerName: new FormControl('', Validators.compose([])),
     invoiceNo: new FormControl('', Validators.compose([])),
     controlNo: new FormControl('', Validators.compose([])),
    })
  }


  getData()
  {
    //  if(this.biilsList.invalid)
    //  {
    //   this.toastr.error("fill all required deteils")
    //    return
    //  }

    const date= new Date(this.biilsList.get('date').value).getFullYear() + "-"+  ("0"+(new Date(this.biilsList.get('date').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.biilsList.get('date').value).getDate()).slice(-2);

     const data = {
      requestType: "BILL_PAYMENTS_LIST",
      date: date,
      payerName: this.biilsList.get("payerName").value,
      invoiceNo: this.biilsList.get("invoiceNo").value,
      controlNo: this.biilsList.get("controlNo").value
      
      
    };


    this.spinner.show();
    this.utilities.postServiceCallX(data).subscribe(
      (res) => {
        const response = res;
       //console.log(response);
        if (response.code == 2000) {
          this.responseData = response.data;
          this.showReceiptDetails = false;
          this.showPayementList = true
        } else {
          this.toastr.error(response.message, 'Error');
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(
          'Something went wrong please try again',
          'Request Failed'
        );
      }
    );
  }

  previewBillsInfo(e)
  {
   
   
    
     const data = {
      requestType: "BILL_PAYMENTS_GET",
      payRef: e.data.id
    };

    
    this.spinner.show();
    this.utilities.postServiceCallX(data).subscribe(
      (res) => {
        const response = res;
        
        if (response.code == 2000) {
          this.responseData = response.data;
          this.controlNo =response.data.controlNo
          this.description =response.data.description
          this.billAmount =response.data.billAmount;
          this.paidAmount =response.data.paidAmount;
          this.paidAmountTotal =response.data.paidAmountTotal;
          this.amountDue =response.data.amountDue;
          this.currency =response.data.currency;
          this.creditAcc =response.data.creditAcc;
          this.pspCode =response.data.pspCode;
          this.payRef =response.data.payRef;
          this.payMethod =response.data.payMethod;
          this.receiptNo =response.data.receiptNo;
          this.createdAt =response.data.createdAt;
          this.invoiceNo =response.data.invoiceNo;
          this.customerId =response.data.customerId;
          this.payerName =response.data.payerName;
          this.customerNo =response.data.customerNo;
          this.invoiceId =response.data.invoiceId;
          this.zmControlNo =response.data.zmControlNo
          this.amountPaidWords =response.data.amountPaidWords;
          this.amountDueWords =response.data.amountDueWords;

          this.showReceiptDetails =true;
          this.showPayementList =false
        } else {
          this.toastr.error(response.message, 'Error');
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(
          'Something went wrong please try again',
          'Request Failed'
        );
      }
    );
  }

  previewBillsInfoN(e)
  {
   
   
    
     const data = {
      requestType: "BILL_PAYMENTS_GET",
      payRef: e.id
    };

    
    this.spinner.show();
    this.utilities.postServiceCallX(data).subscribe(
      (res) => {
        const response = res;
        console.log(response)
        if (response.code == 2000) {
          this.responseData = response.data;
          this.controlNo =response.data.controlNo
          this.description =response.data.description
          this.billAmount =response.data.billAmount;
          this.paidAmount =response.data.paidAmount;
          this.paidAmountTotal =response.data.paidAmountTotal;
          this.amountDue =response.data.amountDue;
          this.currency =response.data.currency;
          this.creditAcc =response.data.creditAcc;
          this.pspCode =response.data.pspCode;
          this.payRef =response.data.payRef;
          this.payMethod =response.data.payMethod;
          this.receiptNo =response.data.receiptNo;
          this.createdAt =response.data.createdAt;
          this.invoiceNo =response.data.invoiceNo;
          this.customerId =response.data.customerId;
          this.payerName =response.data.payerName;
          this.customerNo =response.data.customerNo;
          this.invoiceId =response.data.invoiceId;
          this.zmControlNo =response.data.zmControlNo
          this.amountPaidWords =response.data.amountPaidWords;
          this.amountDueWords =response.data.amountDueWords;

          this.showReceiptDetails =true;
          this.showPayementList =false
        } else {
          this.toastr.error(response.message, 'Error');
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(
          'Something went wrong please try again',
          'Request Failed'
        );
      }
    );
  }


  printInvoiceReceiptZSSF() {
    let popUpWindow;
    //this.hideReceiptTemplate = false;
    const innerContents = document.getElementById('print-container2').innerHTML;
    //this.hideReceiptTemplate = false;
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
    this.showReceiptDetails =false
    this.showPayementList =true
  }

  

}
