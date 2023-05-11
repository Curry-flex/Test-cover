import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: [ './profile.component.scss' ]
})

export class ProfileComponent extends SharedClassComponent implements OnInit {
  title = 'Account Profile';
  endPoint = 'portal/request';
  model_name: string = 'backend/request';
  accountDetailsForm: FormGroup;
  loggedInUserCredentials;
  phones = [];
  changePasswordFrm: FormGroup;
  changePasswordWin: boolean;
  data = {
    userId: 0,
  };
  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
// sets the current page title in index.html title tag
this.appInfo.setTitle(this.title);

this.changePasswordFrm = new FormGroup({
  requestType: new FormControl('USER_PASSWORD_CHANGE', Validators.compose([Validators.required])),
  oldPassword: new FormControl('', Validators.compose([Validators.required])),
  newPassword: new FormControl('', Validators.compose([Validators.required])),
  confirmPassword: new FormControl('', Validators.compose([Validators.required]))
});

this.accountDetailsForm = new FormGroup({
  createdAt: new FormControl(),
  createdBy: new FormControl(),
  email: new FormControl(),
  firstName: new FormControl(),
  lastName: new FormControl(),
  middleName: new FormControl(),
  modifiedAt: new FormControl(),
  modifiedBy: new FormControl(),
  status: new FormControl(),
  systemId: new FormControl(),
  id: new FormControl(),
  userGroup: new FormControl(),
  linkId: new FormControl(),
  designation: new FormControl()
});
this.loggedInUserCredentials = this.authService.getUserDetails();
this.data.userId = this.loggedInUserCredentials.id;
const request = {
  "requestType": "USER_GET",
  "userId": this.loggedInUserCredentials.id
}
this.utilities.postServiceCall(request, this.endPoint).subscribe(
  (res) => {
    this.response = res;
    if (this.response.code == 2000) {
      this.accountDetailsForm.patchValue(this.response.data);
      // this.phones = this.response.data.phones;
    } else {
      this.toastr.error(this.response.message, 'Error');
    }
    this.spinner.hide();
  },
  (error) => {
    this.spinner.hide();
    this.toastr.error(
      'Error occurred, check the communication channel!!',
      'Response'
    );
  }
);
  }

  funcChangeUserPassword() {
    this.changePasswordWin = true;
  }

  OnPasswordReset() {
    if (this.changePasswordFrm.invalid) {
      this.toastr.error('Fill in all the form details', 'Alert');
      return;
    }
    // check the details
    const newPassword = this.changePasswordFrm.get('newPassword').value;
    const  confirmPassword = this.changePasswordFrm.get('confirmPassword').value;
    if (newPassword !== confirmPassword) {
      this.toastr.error('Password Mismatch, please try again', 'Alert');
      this.changePasswordFrm.get('newPassword').setValue(null),
        this.changePasswordFrm.get('confirmPassword').setValue(null);
      return;
    }
    this.spinner.show();
    this.authService
      .changeUserpassword(this.changePasswordFrm.value, this.model_name)
      .subscribe(
        response => {
          this.response = response;
          if (this.response.code == 2000) {
            this.changePasswordWin = false;
            this.toastr.success('Password Changed Successfully!', 'Response');
            this.changePasswordFrm.reset();
            this.changePasswordFrm.get('requestType').patchValue('USER_PASSWORD_CHANGE');
          } else {
            this.toastr.error(this.response.message, 'Alert');
          }
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
          this.toastr.error('Something went wrong, please try again!! Error -> ' + error, 'Alert');
        }
      );
  }


}
