import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-employers-users',
  templateUrl: './employers-users.component.html',
  styleUrls: ['./employers-users.component.scss']
})
export class EmployersUsersComponent extends SharedClassComponent implements OnInit {
  modelName = 'backend/request';
  title = 'Employer User';
  // variables declaration reactive forms
  paramwinfrm: FormGroup;
  questionsForm: FormGroup;
  securityQuestionsForm: FormGroup;
  password: any;

  namePattern: any = /^[^0-9]+$/;
  passwordRegex = '(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,}';

  paramswinpnl: boolean = false; // hide/show the pop up panel
  endpointcall:string; // end point string

  response:any; // hold response data from server
  // object array to store registration data
  RegistrationData: any;

  index = 1; // used as indicator of the string which shows the total qns answered.
  registrationEndPoint = 'backend/request'; // end point
  // datasource

  alertDialogMessage = '';
  showAlertDialog = false;
  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.paramwinfrm = new FormGroup({
      firstName: new FormControl('', Validators.compose([Validators.required, Validators.min(2)])),
      middleName: new FormControl('', Validators.compose([])),
      lastName: new FormControl('', Validators.compose([Validators.required, Validators.min(2)])),
      designation: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl('', Validators.compose([])),
      mobileNo: new FormControl('', Validators.compose([Validators.required])),
      telephoneNo: new FormControl('', Validators.compose([])),
      username: new FormControl(null, Validators.compose([Validators.required])),
      linkId: new FormControl('', Validators.compose([])),
      accountName: new FormControl(null, Validators.compose([Validators.required])),
      userGroup: new FormControl(null, Validators.compose([Validators.required]))
    });
    this.onGetRolesList('USERGROUPS_LIST')
    this.fetchRequestTypes('USERS_LIST', 'EMPLOYERS');
    // this.onGetParamsdetails();

// Controls the datagrid height and max rows to display
    this.observerCall();
  }

  // call getParamsdetails function to refresh datagid
  refreshDataGrid() {
    this.onGetRolesList('USERGROUPS_LIST')
  }

 passwordComparison = () => {
  return this.password;
}
  onSubmitAccountForm() {
    // checks if the submitted form is invalid
    if (this.paramwinfrm.invalid) {
      this.toastr.error('Please fill in all the required details.', 'User Details Required');
      return;
    }

    const requireLinkID= ['EMPLOYER','INDIVIDUAL_CONTRIBUTOR','MONEY_MARKET_CUSTOMER','RENT_CUSTOMER','SALES_CUSTOMER'];

    if (requireLinkID.includes(`${this.paramwinfrm.get('userGroup').value}`)) {
      if(this.paramwinfrm.get('linkId').value === null || this.paramwinfrm.get('linkId').value === undefined || `${this.paramwinfrm.get('linkId').value}`.trim() == '') {
        this.toastr.error(`Link ID is required for ${requireLinkID[requireLinkID.indexOf(`${this.paramwinfrm.get('userGroup').value}`)]} registration.`, 'Link ID Required');
        return;
      }
    }

    this.RegistrationData = {
        requestType: "BACKEND_USER_CREATE",
        firstName: `${this.paramwinfrm.get('firstName').value}`.trim(),
        middleName: `${this.paramwinfrm.get('middleName').value}`.trim(),
        lastName: `${this.paramwinfrm.get('lastName').value}`.trim(),
        linkId: this.paramwinfrm.get('linkId').value,
        username: `${this.paramwinfrm.get('username').value}`.trim(),
        designation: this.paramwinfrm.get('designation').value,
        accountName: this.paramwinfrm.get('accountName').value,
        userGroup: this.paramwinfrm.get('userGroup').value,
        mobileNo: this.paramwinfrm.get('mobileNo').value,
        telephoneNo: this.paramwinfrm.get('telephoneNo').value,
        email: this.paramwinfrm.get('email').value,
    };
    // show loading spinner
    this.spinner.show();
    // call utilities' service postservicecall to submit registration data to server.
    this.utilities
      .postServiceCall(this.RegistrationData, this.registrationEndPoint)
      .subscribe(
        (res) => {
          this.response = res;
          this.spinner.hide();
          if (this.response.code == 2000) {
            const result = this.response;
            this.toastr.success(result.message, 'Response');
            this.paramswinpnl = false;
            this.onGetParamsdetails();
            this.alertDialogMessage = `User account created successfully Username: ${result.data.USERNAME}. Password: ${result.data.password}`;
            this.showAlertDialog = true;
          } else {
            this.toastr.error(this.response.message, 'Error');
          }
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error(
            'Something went wrong, please try again',
            'Request Failed'
          );
        }
      );
  }
  onParamsToolBarPreparing(e) {
    if (this.checkUserAccessRight(['DELETE', 'EDIT'])) {
      e.toolbarOptions.items.unshift( {
        location: 'before',
        widget: 'dxButton',
        options: {
          text: `Create ${this.title}`,
          type: 'default',
          icon: 'fa fa-plus',
          onClick: this.addNewParameter.bind(this)
        }
      }, {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          type: 'default',
         onClick: this.refreshDataGrid.bind(this)
        }
      });
    } else {
      e.toolbarOptions.items.unshift({
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          type: 'default',
         onClick: this.refreshDataGrid.bind(this)
        }
      });
    }


  }
funcpopWidth(percentage_width) {
    if (window.innerWidth > 800){
      return  window.innerWidth * percentage_width / 100;
    } else {
      return  window.innerWidth - 50;
    }

  }

  getCountryCodes() {
    const countryCodes = [
      {
      countryCode: 'TZA',
      phonePrefix: '255'
      },
      {
      countryCode: 'KEN',
      phonePrefix: '254'
      },
      {
      countryCode: 'UGA',
      phonePrefix: '256'
      },
      {
      countryCode: 'BDI',
      phonePrefix: '257'
      },
      {
      countryCode: 'RWA',
      phonePrefix: '250'
      },
      {
      countryCode: 'MWI',
      phonePrefix: '265'
      },
      {
      countryCode: 'ZWE',
      phonePrefix: '263'
      },
      {
      countryCode: 'ZMB',
      phonePrefix: '260'
      }
      ];

    return countryCodes;
  }
  onSubmitUserRegDetails() {

  }

  updateUser(e) {
    if (this.paramwinfrm.invalid) {
      this.toastr.error('Please fill in all the required details.', 'User Details Required');
      return;
    }

    const requireLinkID= ['EMPLOYER','INDIVIDUAL_CONTRIBUTOR','MONEY_MARKET_CUSTOMER','RENT_CUSTOMER','SALES_CUSTOMER'];

    if (requireLinkID.includes(`${this.paramwinfrm.get('userGroup').value}`)) {
      if(this.paramwinfrm.get('linkId').value === null || this.paramwinfrm.get('linkId').value === undefined || `${this.paramwinfrm.get('linkId').value}`.trim() == '') {
        this.toastr.error(`Link ID is required for ${requireLinkID[requireLinkID.indexOf(`${this.paramwinfrm.get('userGroup').value}`)]} registration.`, 'Link ID Required');
        return;
      }
    }

    this.RegistrationData = {
        requestType: "USER_UPDATE",
        userId: e.id,
        firstName: `${this.paramwinfrm.get('firstName').value}`.trim(),
        middleName: `${this.paramwinfrm.get('middleName').value}`.trim(),
        lastName: `${this.paramwinfrm.get('lastName').value}`.trim(),
        linkId: this.paramwinfrm.get('linkId').value,
        username: `${this.paramwinfrm.get('username').value}`.trim(),
        designation: this.paramwinfrm.get('designation').value,
        accountName: this.paramwinfrm.get('accountName').value,
        userGroup: this.paramwinfrm.get('userGroup').value,
        mobileNo: this.paramwinfrm.get('mobileNo').value,
        telephoneNo: this.paramwinfrm.get('telephoneNo').value,
        email: this.paramwinfrm.get('email').value
    };
    // show loading spinner
    this.spinner.show();
    // call utilities' service postservicecall to submit registration data to server.
    this.utilities
      .postServiceCall(this.RegistrationData, this.registrationEndPoint)
      .subscribe(
        (res) => {
          this.response = res;
          this.spinner.hide();
          if (this.response.code == 2000) {
            const result = this.response;
            this.toastr.success(result.message, 'Response');
            this.paramswinpnl = false;
            this.onGetParamsdetails();
          } else {
            this.toastr.error(this.response.message, 'Error');
          }
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          this.toastr.error(
            error.message,
            'Request Failed'
          );
        }
      );
  }

  disableEnableUser(e, flag) {
    const data = {
      requestType: 'USER_ENABLE',
      userId: e.id,
      status: flag
  };
  this.spinner.show();
  this.utilities.postServiceCall(data, 'backend/request').subscribe(res => {
    if (res.code == 2000) {
      this.paramswinpnl = false;
      this.onGetParamsdetails();
      this.toastr.success(res.message);
    } else {
      this.toastr.error(res.message);
    }
    this.spinner.hide();
  }, err => {
    this.toastr.error('Something went wrong while process the request: ' + err.message)
    this.spinner.hide();
  });
  }

}
