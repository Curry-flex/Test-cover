import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';


@Component({
  selector: 'app-individual-contributor',
  templateUrl: './individual-contributor.component.html',
  styleUrls: ['./individual-contributor.component.scss']
})
export class IndividualContributorComponent extends SharedClassComponent implements OnInit {

  modelName = 'backend/request';
  requestType = "REG_IND_CON_REPORT";
  region ="Zanzibar Urban West"


  title = 'Individual Contributor Report';
  //modelName = 'backend/request';
  //requestType = "AT_LOGS";
  hideViewDetailsTable = true;


   member_no:any
   member_name:any
   district_name:any
   Region_name:any
   Date_of_Joining:any
   portal_reg_date:any
   id:any
   responseData:any

   originalData = [];
   modifiedData = [];


  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.fetchRequestTypes('REG_IND_CON_REPORT');
  // Controls the datagrid height and max rows to display
    this.getIndividualReport()
    this.observerCall();
    // sets the current page title in index.html title tag
    this.appInfo.setTitle(this.title);
  }


  getIndividualReport() {
    const data = {
      requestType: this.requestType,
      region:this.region
      
    };
    this.spinner.show();
    this.utilities.postServiceCall(data, this.modelName).subscribe(
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
