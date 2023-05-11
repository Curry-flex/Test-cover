import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { DxPopupModule } from 'devextreme-angular/ui/popup';

import { AuthService, AppInfoService } from '../../services';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxCheckBoxModule } from 'devextreme-angular/ui/check-box';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxValidatorModule } from 'devextreme-angular/ui/validator';
import { DxValidationGroupModule } from 'devextreme-angular/ui/validation-group';

import { AppSettings } from '../../../app-settings';
import { SpinnerVisibilityService } from 'ng-http-loader';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  login = '';
  password = '';
  userLoginForm: FormGroup;
  isLoggedIn: any;
  response: any;
  disableBtn = false;
  rememberMe = true;

  constructor(
    private authService: AuthService,
    public appInfo: AppInfoService,
    private router: Router,
    private spinner: SpinnerVisibilityService,
    public toastr: ToastrService
  ) {
    this.appInfo.setTitle('Login');
    this.userLoginForm = new FormGroup({
      login: new FormControl(null, Validators.compose([Validators.required])),
      password: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
    });
  }
  clearStorage() {
    sessionStorage.removeItem(AppSettings.sTokenKey);
    sessionStorage.removeItem(AppSettings.sIsLoggedInKey);
    sessionStorage.removeItem(AppSettings.sessionStorageUserRoleKey);
    sessionStorage.removeItem(AppSettings.sessionStorageEmployerDetails);
    sessionStorage.clear();
   }
  onLoginClick() {
    if (!this.userLoginForm.valid) {
      this.toastr.error('Please provide your login credentials', 'Credentials are required');
      return;
    }
    this.spinner.show();
    this.disableBtn = true;
    this.authService.logIn(this.login, this.password).subscribe(
      response => {
        const authResponse = response;
        const message = authResponse.message;
        const code = authResponse.code;
        if (code == 2000) {
          this.disableBtn = false;
            // reset all and then set
          this.clearStorage();
          sessionStorage.setItem(AppSettings.isLoggedInKey, authResponse.code);
          sessionStorage.setItem(AppSettings.userDataKey, JSON.stringify(authResponse.data.user));
          sessionStorage.setItem(AppSettings.sessionKey, JSON.stringify(authResponse.data.session));
          this.toastr.success(message, 'Success!');
          this.router.navigate(['/home']);
          location.reload();
        } else if (code === 2113) {
          this.router.navigate(['/change-temporary-password']);
          // sessionStorage.removeItem(AppSettings.sessionKey);
          // sessionStorage.removeItem(AppSettings.isLoggedInKey);
          // sessionStorage.clear();
          sessionStorage.setItem(AppSettings.userDataKey, JSON.stringify(authResponse.data.user));
          sessionStorage.setItem(AppSettings.sessionKey, JSON.stringify(authResponse.data.session));

          this.toastr.info(message);

          // sessionStorage.setItem(AppSettings.isLoggedInKey, authResponse.code);
          // sessionStorage.setItem(AppSettings.userDataKey, JSON.stringify(authResponse.data.user));
          // sessionStorage.setItem(AppSettings.sessionKey, JSON.stringify(authResponse.data.session));
          this.spinner.hide();
        } else {
          this.disableBtn = false;
          sessionStorage.setItem(AppSettings.isLoggedInKey, authResponse.code);
          this.toastr.error(message, 'Alert!');
          this.userLoginForm.reset();
        }
        this.spinner.hide();
      },
      (error) => {
        this.disableBtn = false;
        // tslint:disable-next-line: max-line-length
        // this.toastr.info('Something went wrong, please try again, if problem persists , please contact your system administrator for help!', 'Info!');
        this.toastr.error(error.message);
        this.spinner.hide();
      }
    );
    // this.userLoginForm.reset();
  }
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxPopupModule,
    DxTextBoxModule,
    DxValidatorModule,
    FormsModule,
    ReactiveFormsModule,
    DxValidationGroupModule,
  ],
  declarations: [LoginFormComponent],
  exports: [LoginFormComponent],
})
export class LoginFormModule {}
