import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-benefit-application-create',
  templateUrl: './benefit-application-create.component.html',
  styleUrls: ['./benefit-application-create.component.scss']
})
export class BenefitApplicationCreateComponent extends SharedClassComponent implements OnInit {
  benefitsCreateForm: FormGroup;

  applicationTypeList =[{name: 'New Application'},{name:"Adjustment Application"}]
  terminationReason =[
    {name:"Old age"},
    {name:"Invalidity"},
    {name:"Survival"},
    {name:"Leave Country"},
    {name:"Adjustment Benefits"},
    {name:"Presidential Appointee"}
  ]

  applicationType=[
    {name:"Gratuity - Old Age"},
    {name:"Refund - Old Age"},
  ]
  
  showSelectMember = true
  showApplicationDetails = false
  showPaymentsDetails = false
  showPhotoAndSignature = false
  names: any
  mothersName: any
  paymentsModes = []
  bankList: any =[];
  ngOnInit() {

    this.paymentModes()
    this.getBanks()

    this.benefitsCreateForm = new FormGroup({
     
      postalAddress: new FormControl('', Validators.compose([])),
      physicalAddress: new FormControl('', Validators.compose([])),
      emailAddress: new FormControl('', Validators.compose([])),
      memberNo: new FormControl('', Validators.compose([])),
      appDate: new FormControl('', Validators.compose([])),
      terminationDate: new FormControl('', Validators.compose([])),
      telephone: new FormControl('', Validators.compose([])),
    

    });
  }

  createBenefit()
  {
    

    // const applicationDate = new Date(this.benefitsCreateForm.get('regDate').value).getFullYear() + "-"+  ("0"+(new Date(this.benefitsCreateForm.get('regDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.benefitsCreateForm.get('regDate').value).getDate()).slice(-2);
    // const terminationDate = new Date(this.benefitsCreateForm.get('opDate').value).getFullYear() + "-"+  ("0"+(new Date(this.benefitsCreateForm.get('opDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.benefitsCreateForm.get('opDate').value).getDate()).slice(-2);

    // const data ={
      
    // }
    // this.spinner.show()
    // this.utilities.baseApiPostServiceCall(data).subscribe(res => {
    //   console.log(res)
    //   this.spinner.hide();
    //   if (res.code == 2000) {
    //     this.toastr.success(res.message)
    //     this.benefitsCreateForm.reset();
    //     this.router.navigateByUrl("fumis-employer-list")
        
    //   } else {
    //     this.toastr.error(res.message);
    //   }
    //   this.spinner.hide();
    // }, error => {
    //   this.toastr.error('Something went wrong please try again.');
    //   this.spinner.hide();
    // });
  }

  nextApplicationDetailsForm()
  {
    this.showSelectMember = false;
    this.showApplicationDetails = true
  }

  prevSelectMemberForm()
  {
    this.showSelectMember = true;
    this.showApplicationDetails = false
  }

  nextpaymentForm()
  {
    this.showApplicationDetails = false;
    this.showPaymentsDetails = true
  }


  prevApplicationDetailsForm()
  {
     this.showPaymentsDetails = false;
     this.showApplicationDetails = true
  }


  photoAndSignatureForm()
  {
    this.showPaymentsDetails = false;
    this.showPhotoAndSignature = true
  }

  prevPaymentsForm()
  {
    this.showPhotoAndSignature = false
    this.showPaymentsDetails = true
  }

  getMemberInfo(e)
  {
   

    const data = {
      "requestType": "MEMBER_GET",
      "memberNumber": e.value
    };
    //this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
         this.names = res.data.FullName
         this.mothersName = res.data.MothersName
        } else {
          this.toastr.error(response.message, 'Error');
        }
        //this.spinner.hide();
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
          this.paymentsModes = response.data;
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


  getBanks() {
    const data = {
      requestType: "BANKS_LIST",
      
      
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.bankList = response.data;
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

//
