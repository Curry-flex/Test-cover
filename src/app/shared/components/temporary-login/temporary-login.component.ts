import { Component, OnInit } from '@angular/core';
import { AuthService, AppInfoService } from '../../services';
import { Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';
import { AppSettings } from 'src/app/app-settings';
import { EncryptionService } from '../../services/encryption.service';

@Component({
  selector: 'app-temporary-login',
  templateUrl: './temporary-login.component.html',
  styleUrls: ['./temporary-login.component.scss']
})
export class TemporaryLoginComponent implements OnInit {

  title = 'Change Temporary Password';
  modelName = 'users/password/change';
  errorOnConfirmPassword = false;
  message = '';
  code: number;
  isLoggedIn: any ;
  response: any;
  disableBtn = false;
  data = {
    oldPassword: '',
    newPassword: ''
  };
  tempLoginForm: FormGroup;

  constructor(private authService: AuthService, public appInfo: AppInfoService,
              private router: Router, private spinner: SpinnerVisibilityService,
              public toastr: ToastrService, public utilitiesService: UtilitiesService,
              public securityService: EncryptionService) {

                this.tempLoginForm = new FormGroup({
                  temporaryPassword: new FormControl(null, Validators.required),
                  newPassword: new FormControl(null, Validators.required),
                  confirmNewPassword: new FormControl(null, Validators.required)
                });
     }

  ngOnInit() {
   // sets the current page title in index.html title tag
    this.appInfo.setTitle(this.title);
  }

  onChangedPasswordConfirmed() {
  if (!this.tempLoginForm.valid) {
    this.toastr.error('Fill all the fields to proceed', 'Credentials required!');
    return;
  }

  if (this.tempLoginForm.value.newPassword !== this.tempLoginForm.value.confirmNewPassword) {
   this.errorOnConfirmPassword = true;
   this.toastr.error('Password didn\'t match!');
   return;
  }
  if (this.tempLoginForm.value.temporaryPassword.trim() === '' || this.tempLoginForm.value.newPassword.trim() === '' ||
    this.tempLoginForm.value.confirmNewPassword.trim() === '') {
    this.toastr.error('Whitespaces are not allowed!');
    return;
  }
  if (this.tempLoginForm.value.newPassword.trim().length < 8 || this.tempLoginForm.value.confirmNewPassword.trim().length < 8) {
    this.toastr.error('Minimum Password Length is 8 characters!', 'Password Too short');
    return;
  }

  this.disableBtn = true;
  this.spinner.show();
  this.data.oldPassword = this.tempLoginForm.value.temporaryPassword;
  this.data.newPassword = this.tempLoginForm.value.confirmNewPassword;
  this.utilitiesService.postServiceCall(this.data, this.modelName)
  .subscribe(
      response => {
      const authResponce = response;
      this.message = authResponce.message;
      this.code = authResponce.code;
      if (this.code == 2000) {
        this.disableBtn = false;
        sessionStorage.clear();
        this.router.navigate(['/login']);
        this.toastr.info(this.message, 'Password changed successfully!');
      } else {
        this.disableBtn = false;
        this.toastr.error(this.message, 'Alert!');
      }
      this.spinner.hide();
    },
    error => {
      this.disableBtn = false;
      this.toastr.info(error, 'Error!');
      this.spinner.hide();
    });
  }
}
