import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-maternity-benefits-application-list',
  templateUrl: './maternity-benefits-application-list.component.html',
  styleUrls: ['./maternity-benefits-application-list.component.scss']
})
export class MaternityBenefitsApplicationListComponent extends SharedClassComponent implements OnInit {
  sectorList: any = [];
  districtList: any = [];
  fetchForm: FormGroup;
  maternityBenefitList: any = [];
  paymentModes: any = [];

 

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
    const startDatestring = new Date(this.fetchForm.get('startDate').value).getFullYear() + "-"+  ("0"+(new Date(this.fetchForm.get('startDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.fetchForm.get('startDate').value).getDate()).slice(-2);
    const endDatestring =  new Date(this.fetchForm.get('endDate').value).getFullYear() + "-"+  ("0"+(new Date(this.fetchForm.get('endDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.fetchForm.get('endDate').value).getDate()).slice(-2);

    const data ={
      "requestType": "MATERNITY_BENEFITS_APPLICATION_LIST",
        "sector": this.fetchForm.get('sector').value,
        "districtID": this.fetchForm.get('district').value,
        "employerNumber": this.fetchForm.get('employerNumber').value,
        "startDate": startDatestring,
        "endDate": endDatestring,
        "maternityPaymentCategory": this.fetchForm.get('maternityPaymentCategory').value,
        "rejectionReason": this.fetchForm.get('rejectionReason').value,
        "stage": this.fetchForm.get('stage').value

    }

    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
      
      this.spinner.hide();
      if (res.code == 2000) {
        this.maternityBenefitList = res.data
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

    const data = {

      "requestType": "MATERNITY_BENEFITS_APPLICATION_GET",
        "applicationNo": e.data.ApplicationNo
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          sessionStorage.removeItem("maternityData")
          sessionStorage.setItem("maternityData", JSON.stringify(response.data))
          this.router.navigateByUrl('fumis-maternity-benefit-application-info')
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
