import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-maternity-benefits-application',
  templateUrl: './maternity-benefits-application.component.html',
  styleUrls: ['./maternity-benefits-application.component.scss']
})
export class MaternityBenefitsApplicationComponent extends SharedClassComponent implements OnInit {

  showPersonalDetails = true
  showMaternityDetails = false
  showContribution = false
  showPayment = false
  showSubumitButton = false
  month = [
    {name:"January",value:"01"},
    {name:"February",value:"02"},
    {name:"March",value:"03"},
    {name:"April",value:"04"},
    {name:"May",value:"05"},
    {name:"June",value:"06"},
    {name:"July",value:"07"},
    {name:"August",value:"08"},
    {name:"September",value:"09"},
    {name:"October",value:"10"},
    {name:"November",value:"11"},
    {name:"December",value:"12"},
  ]
  deliveryCategoryList =[]

  babyStatusList =[
    {id:1,name:"Baby Alive"},
    {id:2,name:"Baby Died"},
    {id:3,name:"N/A"}
  ]

  applicationTypeList =[
    {id:1,name:"Maternity Benefit"},
    {id:2,name:"Mortigate Benefit"},
    {id:3,name:"Unemployment Benefit"}
  ]

  applicationCategoryList = [
    {name:"Pregnancy Application"},
    {name:"Live Delivery Application"}
  ]

  years = []
  paymentModeList = [];
  benefitApplicatonForm: FormGroup;
  bankList: any =[];

 

  ngOnInit() {
    this.paymentModes()
    this.getYears()
    this.getBanks()
    this.years = this.getYears()

    this.benefitApplicatonForm = new FormGroup({
      
      memberNo: new FormControl('', Validators.compose([Validators.required])),
      month: new FormControl('', Validators.compose([Validators.required])),
      year: new FormControl('', Validators.compose([Validators.required])),
      physicalAddress: new FormControl('', Validators.compose([Validators.required])),
      postalAddress: new FormControl('', Validators.compose([Validators.required])),
      teleNo: new FormControl('', Validators.compose([])),
      emailAddress: new FormControl('', Validators.compose([])),
      applicationType: new FormControl('', Validators.compose([])),
      lastEmployer: new FormControl('', Validators.compose([])),
      terminationDate: new FormControl('', Validators.compose([])),
      contributionNo: new FormControl('', Validators.compose([])),
      benefitAmount: new FormControl('', Validators.compose([])),
      twinIncrement: new FormControl('', Validators.compose([])),
      totalBenefit: new FormControl('', Validators.compose([])),
      avgSalary: new FormControl('', Validators.compose([])),
      lsMcontribution: new FormControl('', Validators.compose([])),
      applicationCategory: new FormControl('', Validators.compose([])),
      pregAge: new FormControl('', Validators.compose([])),
      babystatus: new FormControl('', Validators.compose([])),
      deliveryCategory: new FormControl('', Validators.compose([])),
      applicationMode: new FormControl('', Validators.compose([])),
      lumPayable: new FormControl('', Validators.compose([])),
      monthlyPension: new FormControl('', Validators.compose([])),
      paymentMode: new FormControl('', Validators.compose([])),
      bankID: new FormControl('', Validators.compose([])),
      accNo: new FormControl('', Validators.compose([])),
      accName: new FormControl('', Validators.compose([])),
      refNo: new FormControl('', Validators.compose([])),

      
      paymentDate: new FormControl('', Validators.compose([])),
      payDetails: new FormControl('', Validators.compose([])),
      authorityID: new FormControl('', Validators.compose([])),
      processingStage: new FormControl('', Validators.compose([])),
      status: new FormControl('', Validators.compose([])),
      rejectionReason: new FormControl('', Validators.compose([])),
      remark: new FormControl('', Validators.compose([])),
      deliveryDate: new FormControl('', Validators.compose([])),
      
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


  createForm()
  {
    

    


    let deliveryDate1
    let paymentDate1
    let termination1

   

    const deliveryDate = new Date(this.benefitApplicatonForm.get('deliveryDate').value).getFullYear() + "-"+  ("0"+(new Date(this.benefitApplicatonForm.get('deliveryDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.benefitApplicatonForm.get('deliveryDate').value).getDate()).slice(-2);
    const paymentDate = new Date(this.benefitApplicatonForm.get('paymentDate').value).getFullYear() + "-"+  ("0"+(new Date(this.benefitApplicatonForm.get('paymentDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.benefitApplicatonForm.get('paymentDate').value).getDate()).slice(-2);
    const terminationDate = new Date(this.benefitApplicatonForm.get('terminationDate').value).getFullYear() + "-"+  ("0"+(new Date(this.benefitApplicatonForm.get('terminationDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.benefitApplicatonForm.get('terminationDate').value).getDate()).slice(-2);



    if(deliveryDate.trim() == "NaN-aN-aN")
    {
      deliveryDate1 = ""
    }
    else{
      deliveryDate1 = deliveryDate
    }

    if(paymentDate.trim() == "NaN-aN-aN")
    {
      paymentDate1 = ""
    }
    else{
      paymentDate1 = paymentDate
    }

    if(terminationDate.trim() == "NaN-aN-aN")
    {
      termination1 = ""
    }
    else{
      termination1 = terminationDate
    }

    const benefitAmount =  this.benefitApplicatonForm.get('benefitAmount').value
    const twinIncrement = this.benefitApplicatonForm.get('twinIncrement').value
    const totalBenefit  =  this.benefitApplicatonForm.get('totalBenefit').value
    const lumpsumPayable = this.benefitApplicatonForm.get('lumPayable').value
    const monthPension  = this.benefitApplicatonForm.get('monthlyPension').value
   

      const data = {

        "requestType": "MATERNITY_BENEFITS_APPLICATION",
        "memberNumber": this.benefitApplicatonForm.get('memberNo').value,
        "lastContributionMonth": this.benefitApplicatonForm.get('month').value,
        "lastContributionYear": this.benefitApplicatonForm.get('year').value,
        "physicalAddress": this.benefitApplicatonForm.get('physicalAddress').value,
        "postalAddress": this.benefitApplicatonForm.get('postalAddress').value,
        "telephoneMobile": this.benefitApplicatonForm.get("teleNo").value,
        "emailAddress": this.benefitApplicatonForm.get('emailAddress').value,
        "applicationTypeID": this.benefitApplicatonForm.get('applicationType').value,
        "lastEmployerID": this.benefitApplicatonForm.get('lastEmployer').value,
        "terminationDate": termination1,
        "numberOfContributions": this.benefitApplicatonForm.get('contributionNo').value,
        "maternityBenefitAmount": +this.benefitApplicatonForm.get('benefitAmount').value,
        "twinIncriment": +this.benefitApplicatonForm.get('twinIncrement').value,
        "totalMaternityBenefit": +this.benefitApplicatonForm.get('totalBenefit').value,
        "averageSalary": +this.benefitApplicatonForm.get('avgSalary').value,
        "lastSixMonthContribution": this.benefitApplicatonForm.get('lsMcontribution').value,
        "applicationCategory": this.benefitApplicatonForm.get('applicationCategory').value,
        "pregAge": this.benefitApplicatonForm.get('pregAge').value,
        "babyStatus": this.benefitApplicatonForm.get('babystatus').value,
        "deliveryCategory": this.benefitApplicatonForm.get('deliveryCategory').value,
        "applicationMode": this.benefitApplicatonForm.get('applicationMode').value,
        "referenceApplication": "",
        "deliveryDate": deliveryDate1,
        "lumpsumPayable": +this.benefitApplicatonForm.get('lumPayable').value,
        "monthlyPension": +this.benefitApplicatonForm.get('monthlyPension').value,
        "modeOfPayment": this.benefitApplicatonForm.get('paymentMode').value,
        "bankID": this.benefitApplicatonForm.get('bankID').value,
        "accountNo": this.benefitApplicatonForm.get('accNo').value,
        "accountName": this.benefitApplicatonForm.get('accName').value,
        "referenceNo": this.benefitApplicatonForm.get('refNo').value,
        "ofBankID": "",
        "paymentDate": paymentDate1,
        "paymentDetails": this.benefitApplicatonForm.get('payDetails').value,
        "authorityID": this.benefitApplicatonForm.get('authorityID').value,
        "processingStageID": this.benefitApplicatonForm.get('processingStage').value,
        "status": this.benefitApplicatonForm.get('status').value,
        "rejectionReasonID": this.benefitApplicatonForm.get('rejectionReason').value,
        "remarks": this.benefitApplicatonForm.get('remark').value
      }
  
      this.spinner.show();
      this.utilities.baseApiPostServiceCall(data).subscribe(res => {
        this.spinner.hide();
        
        const response = res;
        if (response.code == 2000) {
          this.toastr.success(response.message);
          this.benefitApplicatonForm.reset()
          this.router.navigateByUrl("fumis-maternity-benefit-application-list")
        } else {
          this.toastr.error(response.message);
        }
        this.spinner.hide();
      }, err => {
        this.toastr.error(err);
        this.spinner.hide();
      });

    }

    nextMaternityForm()
    {
      this.showPersonalDetails = false;
      this.showMaternityDetails = true;
    }

    nextContributionForm()
    {
      this.showMaternityDetails = false;
      this.showContribution = true
    }

    prevPersonalDetailsForm(){
      this.showMaternityDetails = false
      this.showPersonalDetails = true
    }

    nextPaymentForm()
    {
      this.showContribution = false;
      this.showPayment = true
      this.showSubumitButton = true
    }

    prevMaternityForm()
    {
      this.showContribution = false
      this.showMaternityDetails = true
    }

    prevContributionForm()
    {
      this.showPayment = false
      this.showContribution = true
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
