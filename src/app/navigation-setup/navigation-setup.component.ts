import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from '../shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-navigation-setup',
  templateUrl: './navigation-setup.component.html',
  styleUrls: ['./navigation-setup.component.scss']
})
export class NavigationSetupComponent extends SharedClassComponent implements OnInit {

  title: string = 'Navigations Setup';
  model_name: string = 'backend/request';
  modelName = 'navigations';
  //variables defination
  paramswinpnl: boolean = false;
  paramwinfrm: FormGroup;
  endpointcall: string;
  userRolesDta: any;
  param_id: any;
  response: any;
  navigationLevels: any = [{
    id: 1,
    name: 'Level One'
  }, {
    id: 2,
    name: 'Level Two'
  }, {
    id: 3,
    name: 'Level Three'
  }];

  navigationTypes: any = [{
    id: 1,
    name: 'Online Services'
  }];
  isParentHidden: boolean = true;

  parentNavListData = [];
  accessAllData = [];
  userGroupDataSource = [];
  availableUserGroupsDatasource = [];
  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.appInfo.setTitle(this.title);
    this.paramwinfrm =  new FormGroup({
      requestType: new FormControl(null, Validators.compose([])),
      name: new FormControl(null, Validators.compose([Validators.required])),
      description: new FormControl(null, Validators.compose([Validators.required])),
      parentId: new FormControl(null, Validators.compose([])),
      path: new FormControl(null, Validators.compose([])),
      is_disabled: new FormControl(null, Validators.compose([])),
      is_online: new FormControl(null, Validators.compose([])),
      level: new FormControl(null, Validators.compose([Validators.required])),
      icon: new FormControl(null, Validators.compose([])),
      orderNo: new FormControl(null, Validators.compose([])),
      on_line: new FormControl(1, Validators.compose([])),
      accessAll: new FormControl(null, Validators.compose([])),
      subsidium_02: new FormControl(null, Validators.compose([])),
      subsidium_01: new FormControl(null, Validators.compose([])),
      id: new FormControl(null, Validators.compose([])),
      navId: new FormControl(null, Validators.compose([])),
      usergroup: new FormControl(null, Validators.compose([])),
      code: new FormControl(null, Validators.compose([]))
    });
     // Controls the datagrid height and max rows to display
    this.observerCall();
    this.onGetNavigationList();
    this.onGetAccessAll();
    this.fetchRequestTypes('USERGROUPS_LIST');
  }

  onChangeNavigationLevel(e){
    this.isParentHidden = true;
    if (e.value > 1) {
      this.isParentHidden = false;
    }
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

  createNavigation(requestType) {

    if (this.paramwinfrm.invalid) {
      this.toastr.error('Please fill all form data');
      return;
    }
    this.paramwinfrm.get('requestType').patchValue(requestType);

    this.spinner.show();
    this.utilities.postServiceCall(this.paramwinfrm.value, this.model_name).subscribe(
      response => {
        const res = response;
        if (res.code == 2000) {
          this.toastr.success(res.message);
          this.onGetNavigationList();
          this.paramswinpnl = false;
          if (requestType != 'NAVIGATION_CREATE' && requestType != 'NAVIGATION_DELETE') {
            this.updateUsergroup();
          }
        } else {
          this.toastr.error(res.message);
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

  getNavUsergroups(navId) {
    const data = {
      "requestType": "NAV_USERGROUPS",
      "navId": navId
    };

    this.utilities.postServiceCall(data, this.model_name).subscribe(
      response => {
        if (response.code == 2000) {
          this.availableUserGroupsDatasource = [];
          if (response.data.usergroups !== undefined) {
            for (const el of response.data.usergroups) {
              for (const iterator of this.userGroupDataSource) {
                if (`${el.usergroupName}`.match(iterator.code) && el.accessId != 500) {
                  this.availableUserGroupsDatasource.push(iterator.id);
                }
              }
            }
          } else{
            this.availableUserGroupsDatasource = [];
          }
          this.paramwinfrm.get('usergroup').patchValue(this.availableUserGroupsDatasource);
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

  updateUsergroup() {
    this.spinner.hide();

    const selectedUsergroups = this.paramwinfrm.get('usergroup').value;
    const userGroupIds = [];
    let removedUserGroups = [];

    this.paramwinfrm.get('requestType').patchValue('USERGROUP_NAV_SET');

    const data = {
        "requestType": "USERGROUP_NAV_SET",
        "usergroupId": "",
        "navId": "",
        "accessId": ""
    };
    if (selectedUsergroups.length > 0) {
      for (const element of this.userGroupDataSource) {
        userGroupIds.push(element.id);
      }
      for (const iterator of selectedUsergroups) {
        const index = userGroupIds.indexOf(iterator);
        if (index > -1) {
          userGroupIds.splice(index, 1);
        }
      }

    for (let index = 0; index < selectedUsergroups.length; index++) {
      data.navId = this.paramwinfrm.get('navId').value;
      data.accessId = this.paramwinfrm.get('accessAll').value;
      data.usergroupId = selectedUsergroups[index];
      this.utilities.postServiceCall(data, this.model_name).subscribe(
        response => {
          const res = response;
          if (res.code == 2000) {
          } else {
            this.toastr.error(res.message);
          }
        },
        error => {
          this.spinner.hide();
          this.toastr.error(
            'Error occurred while processing the request - Failed to add usergroup to navigation',
            'Request Failed'
          );
        }
      );
    }



    if (userGroupIds.length > 0) {
      for (let index = 0; index < userGroupIds.length; index++) {
        data.navId = this.paramwinfrm.get('navId').value;
        data.accessId = '500';
        data.usergroupId = userGroupIds[index];
        this.utilities.postServiceCall(data, this.model_name).subscribe(
          response => {
            const res = response;
            if (res.code == 2000) {
            } else {
              this.toastr.error(res.message);
            }
          },
          error => {
            this.spinner.hide();
            this.toastr.error(
              'Error occurred while processing the request - Failed to add usergroup to navigation',
              'Request Failed'
            );
          }
        );
      }
    }

    }

  }

  getMT103Details() {

    const data = {
      "messageType": "MT103",
      "message": "" // <--- actual message goes here
    };

    this.utilities.postServiceCall(res => {
      const response = res;

      if (response.code == 2000) {

      }

    }, error => {

    });
  }

  toolBarPreparing(e, refresh_action) {
    if(this.checkUserAccessRight(['DELETE', 'EDIT'])) {
      e.toolbarOptions.items.unshift(
        {
          location: 'before',
          widget: 'dxButton',
          options: {
            icon: 'add',
            text: 'Add',
            type: 'default',
            onClick: this.addNewParameter.bind(this)
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
        }
      );
    } else {
      e.toolbarOptions.items.unshift({
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


  previewData(e) {
    this.hideSaveButton = false;
    this.hideButton = true;
    this.currentData = e.data;


    this.paramwinfrm.patchValue(e.data);

    this.paramwinfrm.get('navId').setValue(e.data.id);

    this.getNavUsergroups(e.data.id);

    for (const iterator of this.navigationLevels) {
      if (iterator.id == e.data.level) {
        if (iterator.id > 1) {
          this.isParentHidden = false;
        } else {
          this.isParentHidden = true;
        }
        this.paramwinfrm.get('level').setValue(iterator.id);
        break;
      }
    }

    for (const iterator of this.accessAllData) {
      if (iterator.accessId == e.data.accessAll) {
        this.paramwinfrm.get('accessAll').setValue(e.data.accessAll);
        break;
      }
    }

    for (const iterator of this.parentNavListData) {
      if (iterator.id == e.data.parentId) {
        this.paramwinfrm.get('parentId').setValue(iterator.id);
        break;
      }
    }

    this.paramwinfrm.get('usergroup').setValue(null);

    this.paramswinpnl = true;
  }


  fetchRequestTypes(requestType) {
    const data = {
      requestType: requestType
    };
    this.spinner.show();
    this.utilities.postServiceCall(data, this.model_name).subscribe(
      response => {
        if (response.code == 2000) {
          this.userGroupDataSource = response.data;
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
}
