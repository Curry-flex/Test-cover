import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-pensioner-cash-payments',
  templateUrl: './pensioner-cash-payments.component.html',
  styleUrls: ['./pensioner-cash-payments.component.scss']
})
export class PensionerCashPaymentsComponent extends SharedClassComponent implements OnInit {

  month = [
    {name:"January",value:"1"},
    {name:"February",value:"2"},
    {name:"March",value:"3"},
    {name:"April",value:"4"},
    {name:"May",value:"5"},
    {name:"June",value:"6"},
    {name:"July",value:"7"},
    {name:"August",value:"8"},
    {name:"September",value:"9"},
    {name:"October",value:"10"},
    {name:"November",value:"11"},
    {name:"December",value:"12"},
  ]

  years = []
  uncollectedForm: FormGroup;
  uncollectedDatasource = []

  paymentTypes =[{name:"CASH"},{name:"BANK"}]
  cashSelected = false
  bankSelected = false
  data: any

  // constructor() { }

  ngOnInit() {
    this.years = this.getYears()

    this.uncollectedForm = new FormGroup({
      month: new FormControl('', Validators.compose([Validators.required])),
      year: new FormControl('', Validators.compose([Validators.required])),
      payment: new FormControl('', Validators.compose([Validators.required])),
    
    });
  }

  public getYears() {
    const years = [];
    const initialYear = 2017;
    const date = new Date();
    const currentYear = date.getFullYear();
    for (let i = currentYear; i >= initialYear; i--) {
      years.push(i);
    }
    return years;
  }

  getList() {
     
    if(this.uncollectedForm.invalid)
    {
      this.toastr.error("Please enter all required fields");
      return;
    }

    if(this.cashSelected)
    {
       this.data = {
        "requestType": "PENSIONER_CASH_PAYMENTS",
        "paymentYear": this.uncollectedForm.get("year").value,
        "paymentMonth": this.uncollectedForm.get("month").value
       }
   
    }

    if(this.bankSelected)
    {
      this.data = {
        "requestType": "PENSIONER_BANK_PAYMENTS",
        "paymentYear": this.uncollectedForm.get("year").value,
        "paymentMonth": this.uncollectedForm.get("month").value
       }
   
    }

    
     this.spinner.show();
     this.utilities.baseApiPostServiceCall(this.data).subscribe(res => {
       this.spinner.hide();
       //console.log(res)
       const response = res;
       if (response.code == 2000) {
         this.toastr.success(response.message);
         this.uncollectedDatasource = response.data;
       } else {
         this.toastr.error(response.message);
       }
       this.spinner.hide();
     }, err => {
       this.toastr.error(err);
       this.spinner.hide();
     });

   }

   handlePaymentType(e)
   {
      if(`${e.value}`.trim() == 'CASH')
      {
        this.bankSelected = false
        this.cashSelected = true
      }

      if(`${e.value}`.trim() == 'BANK')
      {
        this.cashSelected = false
        this.bankSelected = true 
      }
   }

}
