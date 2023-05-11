import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppSettings } from 'src/app/app-settings';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.scss']
})
export class CreateBillComponent extends SharedClassComponent implements OnInit {
  now: Date = new Date('2071-02-03T08:35:17.632Z');
  billCreateForm: FormGroup;
  fumisBillGenerate:FormGroup
  maxLength = 500;
  amount = 0;
  selectedCurrency = 'TZS';
  endpoint = 'backend/request';
  currencyDts = [
    {
      id: 'TZS',
      text: 'TZS'
    }
  ];
  paymentTypeDts = [
    {
      id: 'EXACT',
      text: 'EXACT'
    },
    {
      id: 'FULL',
      text: 'FULL'
    },
    {
      id: 'PARTIAL',
      text: 'PARTIAL'
    },
    {
      id: 'LIMITED',
      text: 'LIMITED'
    },
    {
      id: 'INFINITY',
      text: 'INFINITY'
    },
    
  ];
  revenueSource = [];

  response={
    CONTROL_NUMBER: '554050104106',
    AMOUNT : '10000',
    PAYER_NAME: 'CURRY-FLEX',
    CURRENCY: 'TZS',
    EXPIRE_DATE:'20-09-2030'
  }

  ngOnInit() {
    this.billCreateForm = new FormGroup({
      payerNumber: new FormControl(null, Validators.compose([])),
      payerName: new FormControl(null, Validators.compose([Validators.required])),
      email: new FormControl(null, Validators.compose([])),
      billExpireDate: new FormControl(null, Validators.compose([])),
      phone: new FormControl(null, Validators.compose([Validators.required])),
      currency: new FormControl(this.currencyDts[0].id, Validators.compose([Validators.required])),
      paymentType: new FormControl('', Validators.compose([Validators.required])),
      exchangeRate: new FormControl(1, Validators.compose([Validators.required])),
      billDescription: new FormControl(null, Validators.compose([Validators.required])),
      revenueSource: new FormControl(null, Validators.compose([Validators.required])),
      billAmount: new FormControl(0, Validators.compose([Validators.required]))
    });

    this.fumisBillGenerate = new FormGroup({
      invoiceNo: new FormControl(null, Validators.compose([Validators.required])),
    })

    const dataCts = {
      requestType:'INVOICE_CATEGORIES_LIST'
    };
    this.utilities.postServiceCall(dataCts, this.endpoint).subscribe(response => {
      const servRes = response.data;
      for(const iterator of servRes) {
        if (iterator.DEPT_CODE_NO == '4') {
          this.revenueSource.push({
            id: iterator.CODE,
            text: iterator.NAME
          });
        }
      }
    }, error => {
      this.toastr.error('Something went wrong while getting revenue sources, please try again later.');
    });
  }

  onFormReset() {
    this.amount = 0;
    this.billCreateForm.reset();
  }


  createBill() {
    if (this.billCreateForm.invalid) {
      this.toastr.error('Bill can not be created, required fields are empty');
      return;
    }

    const billAmt = +this.billCreateForm.get('billAmount').value;

    if (billAmt <= 0) {
      this.toastr.error('Billed amount can not be less or equal to zero.');
      return;
    }

    const rawRequest = {
        requestType : "OTHERS_BILL_GENERATE",
        billDescription: this.billCreateForm.get('billDescription').value,
        payerName: this.billCreateForm.get('payerName').value,
        mobileNo: this.billCreateForm.get('phone').value,
        email: this.billCreateForm.get('email').value,
        invoiceTypeCode: this.billCreateForm.get('revenueSource').value,
        currency: this.billCreateForm.get('currency').value,
        paymentOption: this.billCreateForm.get('paymentType').value,
        billExpireDate: '2071-02-03 11:48:59.353',
        billItems: [
            {
                itemDescrption: this.billCreateForm.get('billDescription').value,
                itemAmount: this.billCreateForm.get('billAmount').value
            }
        ]
    }
    // return;
    this.spinner.show();
    this.utilities.postServiceCall(rawRequest, this.endpoint).subscribe(res => {
      const servRes = res;
     
      this.spinner.hide();
      if (servRes.code == 2000) {
        this.toastr.success('Bill created successfully.');
        sessionStorage.removeItem(AppSettings.billDetailsKey);
        sessionStorage.setItem(AppSettings.billDetailsKey, JSON.stringify(servRes.data));
        //sessionStorage.setItem(AppSettings.billDetailsKey, JSON.stringify(this.response));
        this.router.navigate(['/bill-payment-form']);
        this.onFormReset();
      } else {
        this.toastr.error(servRes.message, 'Request Failed');
      }
    }, err => {
      this.toastr.error('Something went wrong, failed to create the bill.');
  
    });
  }

  createFumisBillHandler()
  {
   if(this.fumisBillGenerate.invalid)
   {
    this.toastr.error("Input invoice number to continue")
    return;
   }

   const rawRequest = {
    requestType : "BILL_CREATE_FUMIS",
    invoiceRef: this.fumisBillGenerate.get("invoiceNo").value
    
}
// return;
      this.spinner.show();
      this.utilities.postServiceCall(rawRequest, this.endpoint).subscribe(res => {
        const servRes = res;
        
        this.spinner.hide();
        if (servRes.code == 2000) {
          this.toastr.success('Bill created successfully.');
          sessionStorage.removeItem(AppSettings.billDetailsKey);
          sessionStorage.setItem(AppSettings.billDetailsKey, JSON.stringify(servRes.data));
          //sessionStorage.setItem(AppSettings.billDetailsKey, JSON.stringify(this.response));
          this.router.navigate(['/bill-payment-form']);
          
        } else {
          this.toastr.error(servRes.message, 'Request Failed');
        }
      }, err => {
        this.toastr.error('Something went wrong, failed to create the bill.');

});
  }
}
