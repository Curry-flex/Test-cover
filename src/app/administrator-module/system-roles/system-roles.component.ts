import { Component, OnInit } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'app-system-roles',
  templateUrl: './system-roles.component.html',
  styleUrls: ['./system-roles.component.scss']
})
export class SystemRolesComponent extends SharedClassComponent implements OnInit {
  title = 'User Groups';
  modelName = 'backend/request';
  requestType = 'USERGROUPS_LIST';

  showViewGrpPrivs = false;
  showAddGrpPrivs = false;
  showRemGrpPrivs = false;

  userGroupPrivileges = [];
  unavailablePrivilegesList = [];
  availablePrivilegesList = [];
  previewHeadersTitle = '';
  usergroupId: any;

  ngOnInit() {
    this.paramwinfrm =  new FormGroup({
      privileges: new FormControl('', Validators.compose([Validators.required]))
    });
    // this.onGetParamsdetails();
    this.fetchRequestTypes(this.requestType);
    // this.onGetOtheRolesdetails('priviledges', this.userRolesDta);
    // Controls the datagrid height and max rows to display
    this.observerCall();
  }

  funcGetCheckValue(isEnabled) {
    if (isEnabled == 1) {
      return true;
    } else {
      return false;
    }
}

onGetUserGroupPrivileges(e, flag) {
  const data = {
    requestType: 'USERGROUP_PRIVILEDGES',
    usegroupId: e.id
  };
  this.usergroupId = e.id;
  if (flag == 1) {
    this.showViewGrpPrivs = true;
    this.previewHeadersTitle = `${e.desc} Privileges`;
  } else {
    this.showRemGrpPrivs = true;
    this.previewHeadersTitle = `Remove ${e.desc} Privileges`;
  }
  this.spinner.show();
  this.utilities.postServiceCall(data, this.modelName).subscribe(
    response => {
      if (response.code == 2000) {
        this.userGroupPrivileges = response.data.priviledges;
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

logEvent(e): void {
  const data = {
        requestType: "PRIVILEDGE_ASSIGNMENT",
        operation: '0',
        usegroup_id: this.usergroupId,
        priviledges: [e.data.id]
  };
  this.spinner.show();
  this.utilities.postServiceCall(data, this.modelName).subscribe(
    response => {
      if (response.code == 2000) {
        this.toastr.success(response.message);
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

filterUserGroups(e): void {
  this.previewHeadersTitle = `Add ${e.desc} Privileges`;
  const data = {
    requestType: 'USERGROUP_PRIVILEDGES',
    usegroupId: e.id
  };
  this.usergroupId = e.id;
  const IDs = [];
  this.spinner.show();
  this.utilities.postServiceCall(data, this.modelName).subscribe(
    response => {
      if (response.code == 2000) {
        for (const iterator of response.data.priviledges) {
          IDs.push(iterator.id);
        }
        const data = {
          requestType: 'PRIVILEDGES_LIST'
        };
        this.spinner.show();
        this.utilities.postServiceCall(data, this.modelName).subscribe(
          response => {
            if (response.code == 2000) {
              this.unavailablePrivilegesList = [];
              for (const iterator of response.data) {
                if (!IDs.includes(iterator.id)) {
                  this.unavailablePrivilegesList.push(iterator)
                }
              }
              this.showAddGrpPrivs = true;
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

addPrivileges() {
  if (this.paramwinfrm.invalid) {
    this.toastr.error('Please select privilege to add');
    return;
  }

  const data = {
    requestType: "PRIVILEDGE_ASSIGNMENT",
    operation: '1',
    usegroup_id: this.usergroupId,
    priviledges: this.paramwinfrm.get('privileges').value
};
this.spinner.show();
this.utilities.postServiceCall(data, this.modelName).subscribe(
response => {
  if (response.code == 2000) {
    this.showAddGrpPrivs = false;
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

}
