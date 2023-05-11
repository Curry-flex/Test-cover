import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { confirm } from 'devextreme/ui/dialog';
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
  paramwinfrm: FormGroup
  paramwinfrm1: FormGroup

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

    this.paramwinfrm1 = new FormGroup({
      code: new FormControl('', Validators.compose([Validators.required])),
      desc: new FormControl('',Validators.compose([Validators.required])),
      id: new FormControl('',Validators.compose([]))
    })


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

addUserGroup()
{

    if(this.paramwinfrm1.invalid)
    {
      this.toastr.error("fill all required fields")
      return;
    }

    const data = {
      requestType: "USERGROUP_CREATE",
      name: this.paramwinfrm1.get("code").value
      
      
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
     
      (res) => {
       // console.log(res)
        const response = res;
        if (response.code == 2000) {
          this.paramswinpnl=false
          
          this.toastr.success("Usergroup added successfully")
          this.refreshDataGrid()
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

updateUsergroup()
{
 
  if(this.paramwinfrm1.invalid)
  {
    this.toastr.error("fill all required fields")
    return;
  }

  const data = {
    requestType: "USERGROUP_UPDATE",
    name: this.paramwinfrm1.get("code").value,
    usergroupId: this.paramwinfrm1.get("id").value
  };
  this.spinner.show();
  this.utilities.postServiceCallNew(data).subscribe(
   
    (res) => {
      console.log(res)
      const response = res;
      if (response.code == 2000) {
        this.paramswinpnl=false
        
        this.toastr.success("Usergroup updated successfully")
        this.refreshDataGrid()
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

deleteUsergroup()
{

  // if(this.paramwinfrm.invalid)
  // {
  //   this.toastr.error("fill all required fields")
  //   return;
  // }
  



  const data = {
    requestType: "USERGROUP_DELETE",
    usergroupId: this.paramwinfrm1.get("id").value
  };

  const result =confirm('Are you sure you want to delete this record?','Delete')
  console.log(result)
     result.then(dialogResult=>{
      if(dialogResult)
      {
        this.spinner.show();
        this.utilities.postServiceCallNew(data).subscribe(
         
          (res) => {
            console.log(res)
            const response = res;
            if (response.code == 2000) {
              this.paramswinpnl=false
              
              this.toastr.success("Usergroup deleted successfully")
              this.refreshDataGrid()
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
     })
  
}

previewDetails(e)
{
  this.paramswinpnl=true
  this.hideSaveButton=false
  this.hideButton=true
 // console.log(e)
 this.paramwinfrm1.patchValue(e.data)
}



}
