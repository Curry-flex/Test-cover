import {
  Component,
  NgModule,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { confirm } from 'devextreme/ui/dialog';
import { AuthService, AppInfoService } from '../../services';
import { UserPanelModule } from '../user-panel/user-panel.component';
import { UtilitiesService } from '../../services/utilities.service';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { ToastrService } from 'ngx-toastr';
import {
  DxDataGridModule,
  DxFormModule,
  DxContextMenuModule,
  DxMenuModule,
  DxDateBoxModule,
  DxTextBoxModule,
  DxPopupModule, DxActionSheetModule
} from 'devextreme-angular';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  appName: string;
  roleName: string = '';
  endpoint: string = 'roles/get';
  data = {
    roleId: 0
  };
  @Output()
  menuToggle = new EventEmitter<boolean>();

  @Input()
  menuToggleEnabled = false;
  model_name: string = 'backend/request';
  endpointcall: string = 'change';
  showActionSheet = false;
  response: any;
  @Input()
  title: string;
  changePasswordFrm: FormGroup;
  changePasswordWin: boolean;
  userMenuItems = [];

    commands: any[] = [
        {
        text: 'Unpaid Contribution Invoices 0',
        icon: 'warning'
        },
        {
         text: 'Unpaid Penalty Invoices 0',
         icon: 'warning'
        },
        {
         text: 'Payment Notifications',
         icon: 'money'
        }
    ];

  employerPenaltiesCounter = 0;
  employerContributionInvoicesCounter = 0;
  employerPaidInvoicesCounter = 0;
  totalNotifications = 0;
  empPenaltiesApiEndPoint = 'employer/penalties';
  empInvoicesApiEndPoint = 'employer/invoices';
  empPaymentEndpoint = 'employer/bills';


  constructor(
    private authService: AuthService,
    public appInfo: AppInfoService,
    private router: Router,
    private spinner: SpinnerVisibilityService,
    public toastr: ToastrService,
    private utilityService: UtilitiesService
  ) {
    this.appName = this.appInfo.title;
    this.changePasswordFrm = new FormGroup({
      requestType: new FormControl('USER_PASSWORD_CHANGE', Validators.compose([Validators.required])),
      oldPassword: new FormControl('', Validators.compose([Validators.required])),
      newPassword: new FormControl('', Validators.compose([Validators.required])),
      confirmPassword: new FormControl('', Validators.compose([Validators.required]))
    });

    const user = this.authService.getUserDetails();
    const userGroup = `${user.userGroup}`.replace('_', ' ');
    this.roleName = `${userGroup} | ${user.accountName === null ? user.firstName+' '+user.lastName : user.accountName}`;
  }

  showNotify(value) {
        // notify('The "' + value + '" button is clicked.');
        this.showActionSheet = false;
    }

  toggleMenu = () => {
    this.menuToggle.emit();
  }
  funcUserLogOut() {
    const result = confirm(
      'Are you sure you want to log out?',
      'Log Out Request.'
    );
    result.then(dialogResult => {
      if (dialogResult) {
        this.authService.logOut();
      }
    });
  }
  funcChangeUserPassword() {
    this.changePasswordWin = true;
  }
  funcpopWidth(percentage_width) {
    if (window.innerWidth > 800) {
      return (window.innerWidth * percentage_width) / 100;
    } else {
      return window.innerWidth - 50;
    }
  }

  openActionSheet() {
    this.showActionSheet = true;
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

@NgModule({
  imports: [
    CommonModule,
    DxButtonModule,
    UserPanelModule,
    DxToolbarModule,
    DxDataGridModule,
    DxFormModule,
    DxContextMenuModule,
    DxMenuModule,
    FormsModule,
    ReactiveFormsModule,
    DxTextBoxModule,
    DxActionSheetModule,
    DxButtonModule,
    DxDataGridModule,
    CommonModule,
    DxPopupModule
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class HeaderModule {}
