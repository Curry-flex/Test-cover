import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from '../shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-user-nav-mapping',
  templateUrl: './user-nav-mapping.component.html',
  styleUrls: ['./user-nav-mapping.component.scss']
})
export class UserNavMappingComponent extends SharedClassComponent implements OnInit {
  title = 'User Groups';
  modelName = 'backend/request';
  requestType = 'USERGROUPS_LIST';

  showViewGrpPrivs = false;
  showAddGrpPrivs = false;
  showRemGrpPrivs = false;

  userGroupPrivileges = [];
  userGroupNavigations = [];
  unavailableNavigationsList = [];
  unavailablePrivilegesList = [];
  availablePrivilegesList = [];
  parentNavListData = [];
  previewHeadersTitle = '';
  usergroupId: any;
  model_name: string = 'backend/request';
  accessAllData = [];
  selectedNavigation: any;

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.paramwinfrm =  new FormGroup({
      navigation: new FormControl('', Validators.compose([Validators.required])),
      accessType: new FormControl('', Validators.compose([Validators.required]))
    });
    this.fetchRequestTypes(this.requestType);
    this.observerCall();
    this.onGetAccessAll();
  }

  onGetAccessAll() {
    const data = {
      "requestType": "ACCESS_LIST"
    };

    this.utilities.postServiceCall(data, this.model_name).subscribe(
      response => {

        const res = response;

        this.accessAllData = res.data;
      },
      error => {
        this.spinner.hide();
        this.toastr.error(
          'Error occurred while processing the request',
          'Request Failed'
        );
        console.error(error);
      }
    );
  }

  funcGetCheckValue(isEnabled) {
    if (isEnabled == 1) {
      return true;
    } else {
      return false;
    }
}


onUserRolesNavigationsdetails(e) {
  const data = {
    "requestType": "USERGROUP_NAV_MENU",
    "usegroup": e.code
}
  this.spinner.show();
  this.utilities.postServiceCall(data, this.model_name).subscribe(res => {
    const response = res;
    if(response.code == 2000){
      this.userGroupNavigations = [];
      for (const iterator of response.data.navMenu) {
        // if (iterator.accessName != 'NO_ACCESS') {
          this.userGroupNavigations.push(iterator);
        // }
        if (iterator.items !== null) {
          for (const item of iterator.items) {
            // if (item.accessName != 'NO_ACCESS') {
              this.userGroupNavigations.push(item);
            // }
          }
        }
      }
    } else {
      this.toastr.error(response.message, 'Failed to load navigations');
    }
    this.spinner.hide();
  }, err => {
    this.toastr.error('Failed to load navigations');
    this.spinner.hide();
  });
}

onGetUserGroupPrivileges(e, flag) {
  const data = {
    requestType: 'USERGROUP_PRIVILEDGES',
    usegroupId: e.id
  };
  this.usergroupId = e.id;
  if (flag == 1) {
    this.showViewGrpPrivs = true;
    this.previewHeadersTitle = `${e.desc} Assigned Navigations`;
  } else {
    this.showRemGrpPrivs = true;
    this.previewHeadersTitle = `Remove ${e.desc} Assigned Navigations`;
  }
  this.onUserRolesNavigationsdetails(e);
}

logEvent(e): void {
  let accessId = 500;
  for (const iterator of this.accessAllData) {
    if (`${iterator.accessName}`.match('NO_ACCESS')) {
      accessId = iterator.accessId;
    }
  }
  const data = {
    requestType: 'USERGROUP_NAV_SET',
    usergroupId: this.usergroupId,
    navId: e.data.id,
    accessId
};
  this.spinner.show();
  this.utilities.postServiceCall(data, this.modelName).subscribe(
    response => {
      if (response.code == 2000) {
        this.toastr.success(response.message);
        this.showRemGrpPrivs = false;
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

assignUserGroup(e) {
  this.previewHeadersTitle = `Update navigation access type`;
  this.selectedNavigation = [];
  this.selectedNavigation.push(e.data);
  this.showAddGrpPrivs = true;
}

filterUserGroups(e): void {
  this.previewHeadersTitle = `Update ${e.desc} navigation`;

  const data = {
    "requestType": "USERGROUP_NAV_MENU",
    "usegroup": e.code
}
this.usergroupId = e.id;
  this.unavailableNavigationsList = [];
  this.utilities.postServiceCall(data, this.modelName).subscribe(res => {
    const response = res;
    if(response.code == 2000){
      this.userGroupNavigations = [];
      for (const iterator of response.data.navMenu) {
        // if (iterator.accessName != 'NO_ACCESS') {
          this.userGroupNavigations.push(iterator);
        // }
        if (iterator.items !== null) {
          for (const item of iterator.items) {
            // if (item.accessName != 'NO_ACCESS') {
              this.userGroupNavigations.push(item);
            // }
          }
        }
      }

      this.showAddGrpPrivs = true;
      const data = {
        "requestType": "NAVIGATIONS_LIST"
      };

      // this.utilities.postServiceCall(data, this.model_name).subscribe(
      //   response => {
      //     const res = response;
      //     this.parentNavListData = res.data;
      //     this.unavailableNavigationsList = [];
      //     for (const iterator of this.parentNavListData) {
      //       if (!IDs.includes(iterator.id)) {
      //         this.unavailableNavigationsList.push(iterator);
      //       }
      //     }
      //     this.showAddGrpPrivs = true;
      //   },
      //   error => {
      //     this.spinner.hide();
      //     this.toastr.error(
      //       'Error occurred while processing the request',
      //       'Request Failed'
      //     );
      //     console.error(error);
      //   }
      // );
    } else {
      this.toastr.error(response.message, 'Failed to load navigations');
    }
  }, err => {
    this.toastr.error('Failed to load navigations');
  });
}

onGetNavigationList() {
  const data = {
    "requestType": "NAVIGATIONS_LIST"
  };

  this.utilities.postServiceCall(data, this.model_name).subscribe(
    response => {

      const res = response;

      this.parentNavListData = res.data;
    },
    error => {
      this.spinner.hide();
      this.toastr.error(
        'Error occurred while processing the request',
        'Request Failed'
      );
      console.error(error);
    }
  );
}

addNavigation() {
  if (this.paramwinfrm.invalid) {
    this.toastr.error('Please select privilege to add');
    return;
  }
  const data = {
    requestType: 'USERGROUP_NAV_SET',
    usergroupId: this.usergroupId,
    navId: this.paramwinfrm.get('navigation').value,
    accessId: this.paramwinfrm.get('accessType').value
};

this.spinner.show();
this.utilities.postServiceCall(data, this.modelName).subscribe(
response => {
  if (response.code == 2000) {
    this.showAddGrpPrivs = false;
    this.showViewGrpPrivs = true;
    this.toastr.success(response.message);
    this.paramwinfrm.reset();
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

onParamsToolBarPreparing2(e) {
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

}
