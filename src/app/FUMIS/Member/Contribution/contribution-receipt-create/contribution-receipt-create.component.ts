import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-contribution-receipt-create',
  templateUrl: './contribution-receipt-create.component.html',
  styleUrls: ['./contribution-receipt-create.component.scss']
})
export class ContributionReceiptCreateComponent extends SharedClassComponent implements OnInit {

  amount: any

  currencyDts = [
    {
      id: 'TZS',
      text: 'TZS'
    }
  ];
 
  branchList: any = [];
  employerList: any = [];
  memberList: any = [];
  paymentModeList = []
  receiptCreateForm: FormGroup;
  memberID: any
  emplyerID: any


  ngOnInit() {

    this.receiptCreateForm = new FormGroup({

      recNum: new FormControl('', Validators.compose([Validators.required])),
      recDate: new FormControl('', Validators.compose([Validators.required])),
      empID: new FormControl('', Validators.compose([Validators.required])),
      memberID: new FormControl('', Validators.compose([Validators.required])),
      branchCode: new FormControl('', Validators.compose([Validators.required])),
      recDetails: new FormControl('', Validators.compose([Validators.required])),
      paymentMode: new FormControl('', Validators.compose([Validators.required])),
      refNo: new FormControl('', Validators.compose([Validators.required])),
      amount: new FormControl('', Validators.compose([Validators.required])),
      currency: new FormControl('', Validators.compose([Validators.required])),
      amountLocal: new FormControl('', Validators.compose([Validators.required])),
     

    });

    this.branch()
    this.paymentModes()
    // this.getEmployers()
    // this.getMembers()
  }


  branch() {
    const data = {
      requestType: "BRANCHES",
      
      
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.branchList = response.data;
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


  fetchEmployerID(e)
  {
    
    const data = {
      "requestType": "EMPLOYERS_GET",
      "employerNumber": e.value
    };
    
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.emplyerID = response.data.EmployerID;
          console.log(this.emplyerID)
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


  fetchMemberID(e)
  {
    
    const data = {
      "requestType": "MEMBER_GET",
      "memberNumber": e.value
    };
    
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.memberID = response.data.MemberID;
          console.log(this.memberID)
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

  paymentModes() {
    const data = {
      requestType: "PAYMENT_MODES",
      
      
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.paymentModeList = response.data;
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


  // getMembers() {
  //   const data = {
  //     requestType: "MEMBERS",
      
      
  //   };
  //   this.spinner.show();
  //   this.utilities.postServiceCallNew(data).subscribe(
  //     (res) => {
  //       const response = res;
  //       if (response.code == 2000) {
  //         this.memberList = response.data;
  //         console.log(this.memberList)
  //       } else {
  //         this.toastr.error(response.message, 'Error');
  //       }
  //       this.spinner.hide();
  //     },
  //     (error) => {
  //       this.spinner.hide();
  //       this.toastr.error(
  //         'Something went wrong please try again',
  //         'Request Failed'
  //       );
  //     }
  //   );
  // }

  createReceipt()
  {

    // if(this.receiptCreateForm.invalid)
    // {
    //   this.toastr.error("Input all required fields")
    // }

    if(this.emplyerID == null)
    {
      this.toastr.error("Please enter correct employer number")
      return;
    }

    if(this.memberID == null)
    {
      this.toastr.error("Please enter correct member number")
      return;
    }

    const creationDate = new Date(this.receiptCreateForm.get('recDate').value).getFullYear() + "-"+  ("0"+(new Date(this.receiptCreateForm.get('recDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.receiptCreateForm.get('recDate').value).getDate()).slice(-2);
    let recDate
    if(creationDate.trim() == "NaN-aN-aN")
    {
      recDate = ""
    }
    else{
      recDate = creationDate
    }

    const data = {
      "requestType": "CONTRIBUTION_RECEIPT_CREATE",
      "receiptNo": this.receiptCreateForm.get("recNum").value,
      "receiptDate": recDate,
      "employerID": this.emplyerID,
      "memberID": this.memberID,
      "receiptDetails": this.receiptCreateForm.get("recDetails").value,
      "paymentMode": this.receiptCreateForm.get("paymentMode").value,
      "referenceNo": this.receiptCreateForm.get("refNo").value,
      "amountReceived": this.receiptCreateForm.get("amount").value,
      "currencyCode": this.receiptCreateForm.get("currency").value,
      "amountReceivedInLocal": this.receiptCreateForm.get("amountLocal").value,
      "branchCode": this.receiptCreateForm.get("branchCode").value
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.toastr.success(response.message);
          this.receiptCreateForm.reset()
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

}
