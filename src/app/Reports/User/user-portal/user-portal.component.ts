import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';


@Component({
  selector: 'app-user-portal',
  templateUrl: './user-portal.component.html',
  styleUrls: ['./user-portal.component.scss']
})
export class UserPortalComponent extends SharedClassComponent implements OnInit {

  //modelName = 'backend/request';
  requestType = "REG_PORTAL_USERS_REPORT";
  usergroup ="EMPLOYER"


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
    this.fetchRequestTypes('REG_PORTAL_USERS_REPORT');
  // Controls the datagrid height and max rows to display
   //this.onViewAdditionalDetails()
   this.getUsersReport()
    this.observerCall();
    // sets the current page title in index.html title tag
    this.appInfo.setTitle(this.title);
  }


  getUsersReport() {
    const data = {
      requestType: "REG_PORTAL_USERS_REPORT",
      region:"EMPLOYER"
      
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
