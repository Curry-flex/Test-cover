import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilitiesService } from '../../services/utilities.service';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, AppInfoService } from '../../services';
import { BreakpointObserver } from '@angular/cdk/layout';
import { confirm } from 'devextreme/ui/dialog';
import { FormGroup } from '@angular/forms';

import { PlottingService } from '../../services/plotting.service';
import { EncryptionService } from '../../services/encryption.service';
import { EncodeDecodeBase64UrlService } from '../../services/encode-decode-base64-url.service';
import { ContributionStorageService } from 'src/app/customers/service/contribution-storage.service';
import { InvoiceService } from 'src/app/customers/service/invoice.service';
import { ContributionService } from '../../services/contribution.service';
import { AppSettings } from 'src/app/app-settings';

@Component({
  selector: 'app-shared-class',
  templateUrl: './shared-class.component.html',
  styleUrls: ['./shared-class.component.scss']
})
export class SharedClassComponent implements OnInit {
  modelName = '';
  portalRequestEndPoint = 'portal/request';
  backEndRequestEndPoint = 'backend/request';
  data: any = {};
  paramDataSet = [];
  allowedPageSises: number[];
  pageSize: number;
  datagridHeight: number;
  tabIndex: any;
  previewBillsWin: boolean = false;
  paramwinfrm: FormGroup;
  paramswinpnl: boolean = false;
  hideSaveButton: boolean;
  hideButton: boolean;
  userStatusDta: any;
  systemNavigationDta: any;
  userAccessLevelDta: any;
  securityQuestions: any;
  randomSecurityQuestions: any;
  userRolesDta: any;
  privilegesWithoutAuth: any;
  rolesList = [];
  registrationTypesWithoutAuth: any;
  waitForApprovalRoutes: any;
  waitForApproval: any;
  noWaitForApproval: any;
  noWaitForApprovalRoutes: any;
  phoneTypeIds: any;
  currentData: any;
  disableEnableTextSwitcher: string;
  tillAllowed: { id: number; text: string; }[];
  authAllowed: { id: number; text: string; }[];
  registrationType: { id: number; text: string; }[];
  needApproval: { id: number; text: string; }[];
  status: { id: number; text: string; }[];
  param_id: any;
  endpointcall: string;
  response: any;
  record_data: any;
  showNextButton = true;
  securityQnInputReadOnly = false;
  hideSenstiveDetails = true;
  hideUserDetailsControls = true;
  hideEnableBtn = true;
  hideDisableBtn = true;
  today = new Date();
  vomisDataSet = [];
  requestType = '';
  currentRoute = '';
  constructor(
    public utilities: UtilitiesService,
    public spinner: SpinnerVisibilityService,
    public toastr: ToastrService,
    public viewRef: ViewContainerRef,
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService,
    public observer: BreakpointObserver,
    public appInfo: AppInfoService,
    public httpClient: HttpClient,
    public contributionService: ContributionService,
    public plottingService: PlottingService,
    public securityService: EncryptionService,
    public base64Service: EncodeDecodeBase64UrlService,
    public invoiceService: InvoiceService,
    public invoiceListStorageService: ContributionStorageService,
  ) {
    this.tillAllowed = [
      {
        id: 1,
        text: 'Yes'
      },
      {
        id: 2,
        text: 'No'
      }
    ];
    this.authAllowed = [
      {
        id: 1,
        text: 'Yes'
      },
      {
        id: 0,
        text: 'No'
      }
    ];
    this.registrationType = [
      {
        id: 1,
        text: 'Local Registration'
      },
      {
        id: 2,
        text: 'Self Registration'
      },
      {
        id: 3,
        text: 'Local or Self Registration'
      }
    ];
    this.needApproval = [
      {
        id: 1,
        text: 'Yes'
      },
      {
        id: 0,
        text: 'No'
      }
    ];
    this.status = [
      {
        id: 1,
        text: 'Enabled'
      },
      {
        id: 0,
        text: 'Disabled'
      }
    ];
   }

  ngOnInit() {
  }


onParamsToolBarPreparing(e) {
   if(this.checkUserAccessRight(['DELETE', 'EDIT'])) {
    e.toolbarOptions.items.unshift(
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          text: 'Add',
          type: 'default',
          icon: 'fa fa-plus',
          onClick: this.addNewParameter.bind(this)
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          type: 'default',
          onClick: this.refreshDataGrid.bind(this)
        }
      }
    );
   } else {
    e.toolbarOptions.items.unshift({
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          type: 'default',
          onClick: this.refreshDataGrid.bind(this)
        }
      }
    );
   }

  }

  onParamsToolBarPreparing2(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          text: 'Add',
          type: 'default',
          icon: 'fa fa-plus',
          onClick: this.addNewParameter.bind(this)
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          type: 'default',
          onClick: this.refreshDataGrid.bind(this)
        }
      }
    );
  }

onToolBarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          type: 'default',
          onClick: this.refreshDataGrid.bind(this)
        }
      }
    );
  }

refreshDataGrid() {
    if(this.modelName == 'backend/request') {

      this.fetchRequestTypes(this.requestType);

      // if (this.requestType == 'PRIVILEDGES_LIST') {
      //   this.fetchRequestTypes(this.requestType);
      // }

      // if (this.requestType == 'USERGROUPS_LIST') {
      //   this.fetchRequestTypes(this.requestType);
      // }
      // if (this.requestType == 'SETTING_LIST') {
      //   this.fetchRequestTypes(this.requestType);
      // }
      // if (this.requestType == 'INVOICE_SUMMARY') {
      //   this.fetchRequestTypes(this.requestType);
      // }

    } else {
      this.onGetParamsdetails();
    }

  }

// method called to close the pop-up dialog when close button is clicked
onPopUpClose() {
  this.paramwinfrm.reset();
  this.paramswinpnl = true;
  this.hideSaveButton = true;
  this.hideButton = false;
}

previewDetails(e, obj) {
  this.hideSaveButton = false;
  this.showNextButton = false;
  this.hideButton = true;
  this.hideSenstiveDetails = true;
  this.hideUserDetailsControls = false;
  this.securityQnInputReadOnly = true;
  this.currentData = e.data;
  this.disableEnableTextSwitcher =
    obj === 'User'
      ? e.data.status === 0
        ? `Enable ${obj}`
        : `Disable ${obj}`
      : e.data.is_enabled === 0
      ? `Enable ${obj}`
      : `Disable ${obj}`;

  if (e.data.status == 1) { // enabled
    this.hideEnableBtn = true;
    this.hideDisableBtn = false;
  }
  if (e.data.status != 1) { // disabled
    this.hideDisableBtn = true;
    this.hideEnableBtn = false;
  }
  if (this.modelName === 'settings') {
    this.paramwinfrm.get('settingId').setValue(e.data.id);
  }
  if (this.modelName === 'roles') {
    this.paramwinfrm.get('roleId').setValue(e.data.id);
  }
  if (this.modelName === 'priviledges') {
    this.paramwinfrm.get('priviledgeId').setValue(e.data.id);
  }
  // if (this.modelName === 'users') {
  //   this.paramwinfrm.get('userId').setValue(e.data.id);
  // }
  if (this.modelName === 'navigations') {
    this.paramwinfrm.get('navId').setValue(e.data.id);
  }
  this.paramwinfrm.patchValue(e.data);
  this.paramswinpnl = true;
}

onUserResetHandler(e) {
  const data = {
    requestType: 'USER_RESET',
    userId: e.id
};
this.spinner.show();
this.utilities.postServiceCall(data, 'backend/request').subscribe(res => {
  if (res.code == 2000) {
    this.paramswinpnl = false;
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
// pop up form presets for insert action
addNewParameter() {
  this.paramwinfrm.reset();
  this.paramswinpnl = true;
  this.hideSaveButton = true;
  this.hideButton = false;
  this.showNextButton = true;
  this.securityQnInputReadOnly = false;
  this.hideSenstiveDetails = false;
  this.hideUserDetailsControls = true;
  this.hideEnableBtn = true;
  this.hideDisableBtn = true;
}

onGetParamsdetails() {
 this.utilities.postServiceCall(this.data, this.modelName).subscribe(
    response => {
      this.paramDataSet = response.data;
    },
    error => {
      this.toastr.error('Error Occured while processing the request');
      this.spinner.hide();
    }
  );
}
logger(message){
  console.log(message);
}

fetchRequestTypes(requestType, scope?) {
  const data = {
    requestType: requestType,
    scope
  };
  this.spinner.show();
  this.utilities.postServiceCall(data, this.modelName).subscribe(
    response => {
      if (response.code == 2000) {
        this.paramDataSet = response.data;
      } else {
        this.toastr.error(response.message);
      }
      this.spinner.hide();
    },
    error => {
      this.toastr.error('Error Occured while processing the request');
      this.spinner.hide();
    }
  );
}

// redirect to the transactions grid specific tab
funLinkTab(index, route) {
  if (route === '/home') {
    if (index === 0) {
      this.tabIndex = 0;
    } else if (index === 1) {
      this.tabIndex = 1;
    } else if (index === 2) {
      this.tabIndex = 2;
    }
  } else {
    if (index === 0) {
      this.router.navigate(['/home'], { queryParams: { tabIndex: 0 } });
      this.tabIndex = 0;
    } else if (index === 1) {
      this.router.navigate(['/home'], { queryParams: { tabIndex: 1 } });
      this.tabIndex = 1;
    } else if (index === 2) {
      this.router.navigate(['/home'], { queryParams: { tabIndex: 2 } });
      this.tabIndex = 2;
    }
  }

  return this.tabIndex;
}
// controls the number of rows to display
dataGridPagerController() {
  if (
    window.innerHeight < 800 &&
    !(window.innerWidth >= 1500 && window.innerWidth <= 1600)
  ) {
    return 7;
  } else if (
    window.innerWidth >= 1500 &&
    window.innerWidth <= 1600 &&
    window.innerHeight <= 800
  ) {
    return 10;
  } else if (window.innerHeight >= 800 && window.innerHeight < 900) {
    return 10;
  } else {
    return 15;
  }
}
// controls the PageSizeSelector
allowedPageSizeController() {
  if (window.innerHeight < 800) {
    return [];
  } else if (window.innerHeight >= 800 && window.innerHeight < 900) {
    return [5, 10];
  } else {
    return [5, 10, 15];
  }
}
// controls the number of rows to display for other datagrids apart from home's ones
otherdataGridPagerController() {
  if (
    window.innerHeight < 800 &&
    !(window.innerWidth >= 1500 && window.innerWidth <= 1600)
  ) {
    return 10;
  } else if (
    window.innerWidth >= 1500 &&
    window.innerWidth <= 1600 &&
    window.innerHeight <= 800
  ) {
    return 15;
  } else if (window.innerHeight >= 800 && window.innerHeight < 870) {
    return 15;
  } else if (window.innerHeight >= 870 && window.innerHeight < 900) {
    return 16;
  } else if (window.innerWidth >= 2000 ) {
    return 23;
  } else if (window.innerWidth >= 1900 ) {
    return 21;
  } else {
    return 19;
  }
}

// controls the PageSizeSelector for other datagrids apart from home's ones
otherAllowedPageSizeController() {
if (window.innerHeight < 800) {
  return [];
} else if (window.innerHeight >= 800 && window.innerHeight < 870) {
  return [5, 10, 15];
} else if (window.innerHeight >= 870 && window.innerHeight < 900) {
  return [5, 10, 16];
} else if (window.innerWidth >= 1900 ) {
  return [5, 10, 15, 21];
} else if (window.innerWidth >= 2000 ) {
  return [5, 10, 15, 23];
} else {
  return [5, 10, 19];
}
}

observerCall() {
  // Controls the datagrid height and width on screen size change detection
  const widthHeightController = () => {
   this.pageSize = this.otherdataGridPagerController();
   this.allowedPageSises = this.otherAllowedPageSizeController();
 };
  this.observer.observe(['(max-width: 1400px)', '(max-height: 800px)']).subscribe(result => {
   const isMatched = Object.values(result.breakpoints);
   if (isMatched[0] && isMatched[1]) {
       // this.tabPanelHeight = 56;
       this.datagridHeight = 57;
       widthHeightController();
     } else if ((window.innerWidth >= 1500 && window.innerWidth <= 1600) && window.innerHeight <= 800 ) {
       // this.tabPanelHeight = 59;
       this.datagridHeight = 54;
       widthHeightController();
     } else {
       // this.tabPanelHeight = 69;
       this.datagridHeight = 67;
       widthHeightController();
     }
 });
}

// set the widget width
funcpopWidth(widthInPercentage) {
  if (window.innerWidth > 800) {
    return (window.innerWidth * widthInPercentage) / 100;
  } else {
    return window.innerWidth - 50;
  }
}
// set the widget height
funcpopHeigt(widthInPercentage) {
  return (window.innerHeight * widthInPercentage) / 100;
}

onGetStatusesParamsdetails(model, dataSet) {
  const data = {};
  this.utilities.postServiceCall(data, model).subscribe(
    response => {
      this.userStatusDta = response.data;
    },
    error => {

    }
  );
}
onGetSystemNavParamsdetails() {
  const data = {};
  this.utilities.postServiceCall(data, 'navigations').subscribe(
    response => {
      this.systemNavigationDta = response.data;
    },
    error => {
    }
  );
}
onGetuserAccessLevelParamsdetails() {
  const data = {};

  this.spinner.show();
  this.utilities.postServiceCall(data, 'access/levels').subscribe(
    response => {
      this.spinner.hide();
      this.userAccessLevelDta = response.data;
    },
    error => {
    }
  );
}
//
onGetOtheRolesdetails(model, dataSet) {
  const data = {};
  this.utilities.postServiceCall(data, model).subscribe(
    response => {
      this.userRolesDta = response.data;
    },
    error => {
    }
  );
}

onGetRolesList(requestType) {
  const data = {requestType};
  this.utilities.baseApiPostServiceCall(data).subscribe(
    response => {
      for (const iterator of response.data) {
        this.rolesList.push({
          userGroup: iterator.code,
          description: iterator.desc
        })
      }
    },
    error => {
      console.log(error);
    }
  );
}

onGetPhoneTypeIDs(model) {
const data = {};
this.utilities.postServiceCall(data, model).subscribe(
  response => {
    this.phoneTypeIds = response.data;
  },
  error => {
  }
);
}

onUserLogOutRequest(message) {
  const result = confirm(
    'Do you want to log-Out(' + message + ') ?',
    'User Log-Out'
  );
  result.then(dialogResult => {
    if (dialogResult) {
      this.authService.logOut();
    }
  });
}

funcGetCheckBoxValue(value, panel) {
  let checkbox_value = 0;
  if (value) {
    checkbox_value = 1;
  }
  this.paramwinfrm.get(panel).setValue(checkbox_value);
}

onCrudActionsClick(action, data) {

  if (action === 'status') {
    this.onDisabledParamsDetails(data);
  }  else if (action === 'delete') {
    this.onDeleteParamsAction(data);
  }
}

onSaveParamsDetails(requestType?: string) {
  if (this.paramwinfrm.get('mobile')) {
    if (!this.paramwinfrm.get('mobile').valid && this.paramwinfrm.get('mobile').touched) {
      this.toastr.error('Phone number must be 10 digits starting with 0', 'Wrong phone number format');
      return;
      }
  }
  if (this.paramwinfrm.get('email')) {
    if (!this.paramwinfrm.get('email').valid && this.paramwinfrm.get('email').touched) {
      this.toastr.error('Email format not valid', 'Wrong email format');
      return;
      }
  }
  if (this.paramwinfrm.invalid) {
    this.toastr.error('Fill in all the form details', 'Response');
    return;
  }
  if (this.paramwinfrm.get('id')) {
    this.param_id = this.paramwinfrm.get('id').value;
  }
  if (this.paramwinfrm.get('userId')) {
    this.paramwinfrm.get('userId').setValue(this.param_id);
  }
  if (this.paramwinfrm.get('roleId')) {
    this.paramwinfrm.get('roleId').setValue(this.param_id);
  }
  if (this.paramwinfrm.get('priviledgeId')) {
    this.paramwinfrm.get('priviledgeId').setValue(this.param_id);
  }
  if (this.paramwinfrm.get('questionId')) {
    this.paramwinfrm.get('questionId').setValue(this.param_id);
  }

  this.endpointcall = 'create';
  if (this.param_id > 0) {
    this.endpointcall = 'update';
  }
  if (this.paramwinfrm.get('is_enabled')) {
    this.funcGetCheckBoxValue(
      this.paramwinfrm.get('is_enabled').value,
      'is_enabled'
    );
  }
  this.spinner.show();
  let postUrl = this.modelName + '/' + this.endpointcall;

  if (this.requestType === 'SETTING_LIST') {
    postUrl = this.modelName;
    if(this.paramwinfrm.get('requestType')) {
      this.paramwinfrm.get('requestType').patchValue(requestType);
      if (this.paramwinfrm.get('settingId')) {
        this.paramwinfrm.get('settingId').setValue(this.param_id);
      }
    }
  }
  this.utilities
    .postServiceCall(
      this.paramwinfrm.value,
      postUrl
    )
    .subscribe(
      response => {
        this.response = response;
        if (this.response.code == 2000) {
          if (this.requestType !== null) {
            this.fetchRequestTypes(this.requestType);
          } else {
            this.onGetParamsdetails();
          }
          this.paramswinpnl = false;
          this.toastr.success(this.response.message, 'Response');
        } else if (this.response.statusId == 2114) {
          this.onUserLogOutRequest(this.response.message);
        } else {
          this.toastr.error(this.response.message, 'Alert');
        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastr.error(
          'Error occurred while processing the request',
          'Request Failed'
        );
      }
    );
}

onDisabledParamsDetails(data) {
  this.param_id = data.id;
  let status = data.status;
  let disable_text = 'Enable';
  this.endpointcall = 'enable';
  this.record_data = {
    user_id: this.param_id
  };
  // if (this.paramwinfrm.get('userId')) {
  //   this.record_data = {
  //     userId: this.param_id
  //   };
  //   this.paramwinfrm.get('userId').setValue(this.param_id);
  // }

  if (this.modelName == 'users') {
    this.record_data = {
      userId: this.param_id
    };
  }

  if (this.modelName == 'permissions') {
    this.record_data = {
      permission_id: this.param_id
    };
  }
  if (this.modelName == 'roles') {
    this.record_data = {
      roleId: this.param_id
    };
  }

  if (status == 1) {
    disable_text = 'Disabled';
    this.endpointcall = 'disable';
  }
  const result = confirm(
    'Are You sure You want to ' + disable_text + ' the selected record?',
    disable_text + ' Record'
  );
  result.then(dialogResult => {
    if (dialogResult) {
      this.paramswinpnl = false;
      this.spinner.show();
      this.utilities
        .postServiceCall(
          this.record_data,
          this.modelName + '/' + this.endpointcall
        )
        .subscribe(
          response => {
            this.response = response;
            // the details
            if (this.response.code == 2000) {
              this.onGetParamsdetails();
              this.toastr.success(this.response.message, 'Response');
            } else if (this.response.code == 2114) {
              this.onUserLogOutRequest(this.response.message);
            } else {
              this.toastr.error(this.response.message, 'Alert');
            }
            this.spinner.hide();
          },
          error => {
            this.toastr.error('Error occurred while processing the request', 'Request Failed');
            this.spinner.hide();
          }
        );
    }
  });
}
onDeleteParamsAction(data) {

  this.param_id = data.id;
  this.endpointcall = 'delete';
  this.record_data = {
    id: this.param_id
  };
  if (this.modelName == 'currency/denominations') {
    this.record_data = {
      denomination_id: this.param_id
    };
  }
  if (this.modelName == 'settings') {
    this.record_data = {
      settingId: this.param_id
    };
  }
  if (this.modelName == 'priviledges') {
    this.record_data = {
      priviledgeId: this.param_id
    };
  }
  if (this.modelName == 'questions') {
    this.record_data = {
      questionId: this.param_id
    };
  }
  if (this.modelName == 'users') {
    this.record_data = {
      userId: this.param_id
    };
  }
  if (this.modelName == 'account/types') {
    this.record_data = {
      account_type_id: this.param_id
    };
  }
  if (this.modelName == 'access/levels') {
    this.record_data = {
      access_level_id: this.param_id
    };
  }
  if (this.modelName == 'roles') {
    this.record_data = {
      roleId: this.param_id
    };
  }
  if (this.modelName == 'status') {
    this.record_data = {
      status_id: this.param_id
    };
  }
  if (this.modelName == 'navigation/types') {
    this.record_data = {
      navigation_type_id: this.param_id
    };
  }
  if (this.modelName == 'navigation/levels') {
    this.record_data = {
      navigation_level_id: this.param_id
    };
  }
  if (this.modelName == 'permissions') {
    this.record_data = {
      permission_id: this.param_id
    };
  }
  const result = confirm(
    'Are You sure You want to delete the selected record?',
    'Delete Record'
  );
  result.then(dialogResult => {
    if (dialogResult) {
      this.paramswinpnl = false;
      this.spinner.show();
      this.utilities
        .postServiceCall(
          this.record_data,
          this.modelName + '/' + this.endpointcall
        )
        .subscribe(
          response => {
            this.response = response;

            if (this.response.code == 2000) {
              this.onGetParamsdetails();
              this.toastr.success(this.response.message, 'Response');
            } else {
              this.toastr.error(this.response.message, 'Alert');
            }
            this.spinner.hide();
          },
          error => {
            this.toastr.error('Error occurred while processing the request',
            'Request Failed');
            this.spinner.hide();
          }
        );
    }
  });
}

vomisApiReqRes() {
  this.spinner.show();
  const pfi = {
    requestType: this.requestType
  };

  this.utilities.postServiceCall(pfi, 'backend/request').subscribe(res => {
    const buffer = res;
    if (buffer.code == 2000) {
      this.vomisDataSet = [];
      for (const iterator of buffer.data) {
        this.vomisDataSet.push({
          id: iterator.ID,
          txnDate: iterator.CREATED_AT,
          memberNumber: iterator.MEMBERSHIP_NUMBER,
          memberName: iterator.MEMBERSHIP_NAME,
          memberType: iterator.MEMBERSHIP_TYPE,
          reqId: iterator.REQUEST_ID,
          resId: iterator.RESPONSE_ID,
          code: iterator.STATUS_CODE,
          message: iterator.STATUS_MSG,
          rawData: iterator.RAW_DATA,
          amount: iterator.AMOUNT,
          channel: iterator.CHANNEL,
          currency: iterator.CURRENCY,
          dimensionCode: iterator.DIMENSION_CODE,
          pspRef: iterator.PSP_REF_NO,
          vdId: iterator.VALIDATION_REQUEST_ID,
          paymentMode: iterator.PAYMENT_MODE,
          receiptNo: iterator.RECEIPT_NO,
          PQ_ID: iterator.PQ_ID,
          PQ_CREATED_AT: iterator.PQ_CREATED_AT,
          PQ_AMOUNT: iterator.PQ_AMOUNT,
          PQ_CURRENCY: iterator.PQ_CURRENCY,
          PQ_MEMBERSHIP_NUMBER: iterator.PQ_MEMBERSHIP_NUMBER,
          PS_ID: iterator.PS_ID,
          PS_CREATED_AT: iterator.PS_CREATED_AT,
          PS_MEMBERSHIP_TYPE: iterator.PS_MEMBERSHIP_TYPE,
          PS_MEMBERSHIP_NAME: iterator.PS_MEMBERSHIP_NAME,
          PS_STATUS_CODE: iterator.PS_STATUS_CODE,
          PS_STATUS_MSG: iterator.PS_STATUS_MSG,
          NAV_REC_NO: iterator.NAV_REC_NO,
          NAV_RECEIPT: iterator.NAV_RECEIPT,
          PUSH_FLAG: iterator.PUSH_FLAG
        });
      }
    } else {
      this.toastr.error(buffer.message);
    }
    this.spinner.hide();
  }, err => {
    this.spinner.hide();
  });
}

onToolBarVomisPreparing(e, refresh_action, param) {
  e.toolbarOptions.items.unshift(
    {
      location: 'before',
      widget: 'dxButton',
      options: {
        text: param,
        stylingMode: 'text',
        type: 'default',
      }
    },
    {
    location: 'after',
    widget: 'dxButton',
    options: {
      icon: 'refresh',
      type: 'default',
      onClick: refresh_action.bind(this)
    }
  });
}

checkUserAccessRight(accessName): Boolean {
  const usergroupNavigation = JSON.parse(sessionStorage.getItem(AppSettings.userGroupKey));
  console.log('Current Route: ' + this.currentRoute);
  let userHasAccess = false;
  for (const iterator of usergroupNavigation) {
    if(iterator.path == this.currentRoute) {
      if (accessName.includes(iterator.accessName)) {
        userHasAccess = true;
      }
      break;
    }
  }
  return userHasAccess;
}

isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if(!dateString.match(regEx)) return false;  // Invalid format
  var d = new Date(dateString);
  var dNum = d.getTime();
  if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0,10) === dateString;
}

}

