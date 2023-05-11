import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { confirm } from 'devextreme/ui/dialog';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent extends SharedClassComponent implements OnInit {
  showDialog = false;
  popUpTitle = 'Edit PSP Details';
  hideSaveActionButton = true;
  editPspForm: FormGroup;
  title = 'PSP Registration';

  datasource = [
    {
      pspId: 1,
      psp: 'CRDB',
      pspCode: 'PSP001',
      dateCreated: '2020-11-08',
      dateModified: '2020-11-07',
      status: 1
    },
    {
      pspId: 2,
      psp: 'NMB',
      pspCode: 'PSP002',
      dateCreated: '2020-11-08',
      dateModified: '2020-11-08',
      status: 1
    },
    {
      pspId: 3,
      psp: 'NBC',
      pspCode: 'PSP003',
      dateCreated: '2020-11-08',
      dateModified: '2020-11-08',
      status: 1
    },
    {
      pspId: 4,
      psp: 'PBZ',
      pspCode: 'PSP004',
      dateCreated: '2020-11-08',
      dateModified: '2020-11-08',
      status: 1
    },
    {
      pspId: 5,
      psp: 'BOA',
      pspCode: 'PSP005',
      dateCreated: '2020-11-08',
      dateModified: '2020-11-08',
      status: 1
    },
    {
      pspId: 6,
      psp: 'TIGO',
      pspCode: 'PSP006',
      dateCreated: '2020-11-08',
      dateModified: '2020-11-08',
      status: 1
    },
    {
      pspId: 7,
      psp: 'ZANTEL',
      pspCode: 'PSP007',
      dateCreated: '2020-11-08',
      dateModified: '2020-11-08',
      status: 1
    },
    {
      pspId: 8,
      psp: 'AIRTEL',
      pspCode: 'PSP008',
      dateCreated: '2020-11-08',
      dateModified: '2020-11-08',
      status: 1
    },
    {
      pspId: 9,
      psp: 'VODACOM',
      pspCode: 'PSP009',
      dateCreated: '2020-11-08',
      dateModified: '2020-11-08',
      status: 1
    },
  ];
  now = new Date();
  ngOnInit() {
    this.editPspForm = new FormGroup({
      pspId: new FormControl(null, Validators.compose([])),
      psp: new FormControl(null, Validators.compose([Validators.required])),
      pspCode:  new FormControl(null, Validators.compose([Validators.required])),
      dateCreated:  new FormControl(null, Validators.compose([Validators.required])),
      dateModified:  new FormControl(null, Validators.compose([Validators.required])),
      status: new FormControl(null, Validators.compose([Validators.required]))
    });
    this.appInfo.setTitle(this.title);
    this.observerCall();
  }

  onEditListener(e) {
    this.popUpTitle = 'Edit PSP Details';
    this.hideSaveActionButton = true;
    this.showDialog = true;
    this.editPspForm.patchValue(e);
  }
  onSaveListener(e) {
    this.editPspForm.reset();
    this.popUpTitle = 'Register new PSP';
    this.hideSaveActionButton = false;
    this.showDialog = true;
  }
  onActivateListener(e) {
    const result = confirm(
      'Are you sure you want to activate selected PSP ?',
      'Activate'
    );
    result.then(dialogResult => {
      if (dialogResult) {
        this.activateDeactivateStatus(1, e);
      }
    });
  }
  onDeactivateListerner(e) {
    const result = confirm(
      'Are you sure you want to De-activate selected PSP ?',
      'De-activate'
    );
    result.then(dialogResult => {
      if (dialogResult) {
        this.activateDeactivateStatus(0, e);
      }
    });
  }
  onDeleteListener(e) {
    const result = confirm(
      'Are you sure you want to delete selected PSP ?',
      'Delete PSP'
    );
    result.then(dialogResult => {
      if (dialogResult) {

    for (let index = 0; index < this.datasource.length; index++) {
      if (this.datasource[index].pspId === e.pspId) {
        this.datasource.splice(index, 1);
        break;
      }
    }
      }
    });
  }

  activateDeactivateStatus(status, e) {
    for (let index = 0; index < this.datasource.length; index++) {
      if (this.datasource[index].pspId === e.pspId) {
        this.datasource[index].status = status;
        this.datasource[index].dateModified = this.now.toDateString();
        break;
      }
    }
  }

  saveEditedData() {
    if (this.editPspForm.invalid) {
      this.toastr.error('Empty inputs are not allowed');
      return;
    }
    if (!this.checkPspCodeAvailability(this.editPspForm.get('pspCode').value)) {
      this.toastr.error('PSP Code already registered');
      return;
   }
    this.spinner.show();
    setTimeout(() => {
      for (let index = 0; index < this.datasource.length; index++) {
        if (this.datasource[index].pspId === this.editPspForm.get('pspId').value) {
          this.datasource[index] = this.editPspForm.value;
          this.datasource[index].dateModified = this.now.toDateString();
          this.showDialog = false;
          this.spinner.hide();
          break;
        }
      }
    }, 1000);

  }

  onSubmitRegistrationData() {
    const id = this.datasource.length + 1;
    this.editPspForm.get('pspId').patchValue(id);
    this.editPspForm.get('status').patchValue(0);
    this.editPspForm.get('dateCreated').patchValue(this.now.toDateString());
    this.editPspForm.get('dateModified').patchValue(this.now.toDateString());

    if (this.editPspForm.invalid) {
      this.toastr.error('Empty inputs are not allowed');
      return;
    }
    if (!this.checkPspCodeAvailability(this.editPspForm.get('pspCode').value)) {
       this.toastr.error('PSP Code already registered');
       return;
    }
    this.spinner.show();
    setTimeout(() => {
    this.datasource.push(this.editPspForm.value);
    this.hideSaveActionButton = true;
    this.showDialog = false;
    this.spinner.hide();
    }, 1000);
  }

  checkPspCodeAvailability(pspCode) {
    const psp = pspCode.toLowerCase();
    for (const iterator of this.datasource) {
      if (iterator.pspCode.toLowerCase() == psp ) {
        return false;
      } else {
        return true;
      }
    }
  }

  paramsToolBarPreparing(e) {
    e.toolbarOptions.items.unshift(

      {
        location: 'before',
        widget: 'dxButton',
        options: {
          text: 'Add PSP',
          type: 'default',
          icon: 'fa fa-plus',
          onClick: this.onSaveListener.bind(this)
        }
      }
    );
  }

}
