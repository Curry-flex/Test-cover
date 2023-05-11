import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';


@Component({
  selector: 'app-employer-registration',
  templateUrl: './employer-registration.component.html',
  styleUrls: ['./employer-registration.component.scss']
})
export class EmployerRegistrationComponent extends SharedClassComponent implements OnInit {

  //modelName = 'backend/request';
  requestType = "REG_EMPLOYERS_REPORT";
  region ="Zanzibar Urban West"
  sector = "Parastatal"

  title = 'Employer Registration Report';
  //modelName = 'backend/request';
  //requestType = "AT_LOGS";
  hideViewDetailsTable = true;


  empNo: any
  empName: any
  disName: any
  rgName: any
  sector1: any
  foDate: any
  poReg:any
  poRegDate:any
  responseData:any

  originalData = [];
  modifiedData = [];

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.fetchRequestTypes('REG_EMPLOYERS_REPORT');
  // Controls the datagrid height and max rows to display
   //this.onViewAdditionalDetails()
    this.observerCall();

    this.getEmployersReport()
    // sets the current page title in index.html title tag
    this.appInfo.setTitle(this.title);
  }


  getEmployersReport() {
    const data = {
      requestType: this.requestType,
      region: this.region,
      sector:this.sector
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.responseData = response.data;
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

 

  onCloseViewDetailsTable() {
    this.hideViewDetailsTable = true;
  }
}
