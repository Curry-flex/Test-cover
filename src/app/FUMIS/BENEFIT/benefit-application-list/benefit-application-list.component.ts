import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-benefit-application-list',
  templateUrl: './benefit-application-list.component.html',
  styleUrls: ['./benefit-application-list.component.scss']
})
export class BenefitApplicationListComponent extends SharedClassComponent implements OnInit {

  sectorList: any = [];
  districtList: any = [];
  fetchForm: FormGroup;
  BenefitList: any = [];
  paymentModes: any = [];
  actionWindow = false
  applicationNumber: any
  historyDatasource: any = [];
  showHistory = false
  showList = true

 

  ngOnInit() {
    this.getSectors()
    this.getDistricts()
    //this.paymentOptionGet()

    this.fetchForm = new FormGroup({

      startDate: new FormControl(this.today, Validators.compose([])),
      endDate: new FormControl(this.today, Validators.compose([])),
      district: new FormControl('', Validators.compose([])),
      sector: new FormControl('', Validators.compose([])),
      employerNumber: new FormControl('', Validators.compose([])),
      maternityPaymentCategory: new FormControl('', Validators.compose([])),
      rejectionReason: new FormControl('', Validators.compose([])),
      stage: new FormControl('', Validators.compose([])),
     

    });

  }

  getSectors() {
    const data = {
      requestType: "SECTOR_LIST",
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.sectorList = response.data;
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

  getDistricts() {
    const data = {
      requestType: "DISTRICT_LIST",
      
      
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.districtList = response.data;
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

  paymentOptionGet() {
    const data = {
      requestType: "PAYMENT_MODES_LIST",
      
      
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.paymentModes = response.data;
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

  filterList()
  {
    this.showList = true;
    this.showHistory =  false
    const startDatestring = new Date(this.fetchForm.get('startDate').value).getFullYear() + "-"+  ("0"+(new Date(this.fetchForm.get('startDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.fetchForm.get('startDate').value).getDate()).slice(-2);
    const endDatestring =  new Date(this.fetchForm.get('endDate').value).getFullYear() + "-"+  ("0"+(new Date(this.fetchForm.get('endDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.fetchForm.get('endDate').value).getDate()).slice(-2);

    const data ={
      "requestType": "BENEFIT_APPLICATION_LIST",
        "sector": this.fetchForm.get('sector').value,
        "districtID": this.fetchForm.get('district').value,
        "employerNumber": this.fetchForm.get('employerNumber').value,
        "startDate": startDatestring,
        "endDate": endDatestring,
        "rejectionReason": this.fetchForm.get('rejectionReason').value,
        "stage": this.fetchForm.get('stage').value

    }

    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
      
      this.spinner.hide();
      if (res.code == 2000) {
        this.BenefitList = res.data
        this.toastr.success(res.message)
       
        
      } else {
        this.toastr.error(res.message);
      }
      this.spinner.hide();
    }, error => {
      this.toastr.error('Something went wrong please try again.');
      this.spinner.hide();
    });

  }

  previewDetailsu(e)
  {
    //console.log(e.data.EmployerNumber);
    this.applicationNumber = e.data.ApplicationNo
    this.actionWindow = true
    // const data = {

    //   "requestType": "BENEFIT_APPLICATION_GET",
    //     "applicationNo": e.data.ApplicationNo
    // };
    // this.spinner.show();
    // this.utilities.postServiceCallNew(data).subscribe(
    //   (res) => {
    //     const response = res;
    //     if (response.code == 2000) {
    //       sessionStorage.removeItem("benefitData")
    //       sessionStorage.setItem("benefitData", JSON.stringify(response.data))
    //       this.router.navigateByUrl('fumis-benefit-application-info')
    //     } else {
    //       this.toastr.error(response.message, 'Error');
    //     }
    //     this.spinner.hide();
    //   },
    //   (error) => {
    //     this.spinner.hide();
    //     this.toastr.error(
    //       'Something went wrong please try again',
    //       'Request Failed'
    //     );
    //   }
    // );
  }
 
  viewDetails()
  {
    const data = {

      "requestType": "BENEFIT_APPLICATION_GET",
        "applicationNo": this.applicationNumber
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          sessionStorage.removeItem("benefitData")
          sessionStorage.setItem("benefitData", JSON.stringify(response.data))
          this.router.navigateByUrl('fumis-benefit-application-info')
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

  viewHistory()
  {
    this.showList = false;
    this.showHistory = true
    this.actionWindow = false;

    const data = {
    
      "requestType": "BENEFIT_APPLICATION_HISTORY",
      "applicationNo": this.applicationNumber


    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.historyDatasource = response.data;
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
