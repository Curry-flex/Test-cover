import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-employers-allotment-list',
  templateUrl: './employers-allotment-list.component.html',
  styleUrls: ['./employers-allotment-list.component.scss']
})
export class EmployersAllotmentListComponent extends SharedClassComponent implements OnInit {
  title = 'Employers Allotment Configuration/Setting';
  endPoint = 'backend/request';
  employersListDatasource = [];

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.appInfo.setTitle(this.title);
    this.observerCall();
    this.getEmployeesList();
  }


  getEmployeesList() {
    const data = {
      requestType: 'EMPLOYERS_LIST'
    };
    this.spinner.show();
    this.utilities.postServiceCall(data, this.endPoint).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.employersListDatasource = [];
          this.employersListDatasource = response.data;
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

  updateAllotment(data, value) {
    const request = {
      "requestType": "EMPLOYER_AUTO_ALLOT_UPDATE",
      "employerRef": data.employerID,
      "value": value
    };
    this.spinner.show();
    this.utilities.postServiceCall(request, this.endPoint).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.toastr.info('Please wait while setting is being applied');
          this.getEmployeesList();
          this.spinner.hide();
        } else {
          this.toastr.error(response.message, 'Error');
          this.spinner.hide();
        }
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

  updateMultiInstallment(data, value) {
    const request = {
      "requestType": "EMPLOYER_MULT_INSTALLMENTS_UPDATE",
      "employerRef": data.employerID,
      "value": value
    };
    this.spinner.show();
    this.utilities.postServiceCall(request, this.endPoint).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.toastr.info('Please wait while setting is being applied');
          this.getEmployeesList();
          this.spinner.hide();
        } else {
          this.toastr.error(response.message, 'Error');
          this.spinner.hide();
        }
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


  toolBarPreparing(e, refresh_action) {
    e.toolbarOptions.items.unshift(
         {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          type: 'default',
          onClick: refresh_action.bind(this)
        }
      }
    );
  }

}
