import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { confirm } from 'devextreme/ui/dialog';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-api-communication-link',
  templateUrl: './api-communication-link.component.html',
  styleUrls: ['./api-communication-link.component.scss']
})
export class ApiCommunicationLinkComponent extends SharedClassComponent   implements OnInit {

  showDialog = false;
  popUpTitle = 'Edit API Communication Link';
  hideSaveActionButton = true;
  apiLinkForm: FormGroup;
  title = 'API Communication Links';

  datasource = [
    {
      id: 1,
      linkId: 'APCL001',
      apiCategory: 'Bill Validation',
      urlPath: 'http://192.168.1.45/api/bill/validation',
      status: 1
    },
    {
      id: 2,
      linkId: 'APCL002',
      apiCategory: 'Post Payment',
      urlPath: 'http://192.168.1.45/api/post/payment',
      status: 1
    },
    {
      id: 3,
      linkId: 'APCL003',
      apiCategory: 'Bank Reconciliation',
      urlPath: 'http://192.168.1.45/api/bank/reconciliation',
      status: 1
    },
    {
      id: 4,
      linkId: 'APCL004',
      apiCategory: 'Bank Statement',
      urlPath: 'http://192.168.1.45/api/bank/statement',
      status: 1
    },
    {
      id: 5,
      linkId: 'APCL005',
      apiCategory: 'Callback',
      urlPath: 'http://192.168.1.45/api/callback',
      status: 1
    }
  ];

  ngOnInit() {
    this.apiLinkForm = new FormGroup({
      id: new FormControl(null, Validators.compose([])),
      linkId: new FormControl(null, Validators.compose([Validators.required])),
      apiCategory:  new FormControl(null, Validators.compose([Validators.required])),
      urlPath:  new FormControl(null, Validators.compose([Validators.required])),
      status: new FormControl(null, Validators.compose([Validators.required]))
    });
    this.appInfo.setTitle(this.title);
    this.observerCall();
  }

  onEditListener(e) {
    this.popUpTitle = 'Edit API Communication Link';
    this.hideSaveActionButton = true;
    this.showDialog = true;
    this.apiLinkForm.patchValue(e);
  }
  onSaveListener(e) {
    this.apiLinkForm.reset();
    this.popUpTitle = 'Register new API Communication Link';
    this.hideSaveActionButton = false;
    this.showDialog = true;
  }
  onActivateListener(e) {
    const result = confirm(
      'Are you sure you want to activate selected API Communication Link ?',
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
      'Are you sure you want to De-activate selected API Communication Link ?',
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
      'Are you sure you want to delete selected API Communication Link ?',
      'Delete PSP'
    );
    result.then(dialogResult => {
      if (dialogResult) {

    for (let index = 0; index < this.datasource.length; index++) {
      if (this.datasource[index].id === e.id) {
        this.datasource.splice(index, 1);
        break;
      }
    }
      }
    });
  }

  activateDeactivateStatus(status, e) {
    for (let index = 0; index < this.datasource.length; index++) {
      if (this.datasource[index].id === e.id) {
        this.datasource[index].status = status;
        break;
      }
    }
  }

  saveEditedData() {
    if (this.apiLinkForm.invalid) {
      this.toastr.error('Empty inputs are not allowed');
      return;
    }
    this.spinner.show();
    setTimeout(() => {
      for (let index = 0; index < this.datasource.length; index++) {
        if (this.datasource[index].id === this.apiLinkForm.get('id').value) {
          this.datasource[index] = this.apiLinkForm.value;
          this.showDialog = false;
          this.spinner.hide();
          break;
        }
      }
    }, 1000);

  }

  onSubmitRegistrationData() {
    const id = this.datasource.length + 1;
    this.apiLinkForm.get('id').patchValue(id);
    this.apiLinkForm.get('status').patchValue(0);
    if (this.apiLinkForm.invalid) {
      this.toastr.error('Empty inputs are not allowed');
      return;
    }
    this.spinner.show();
    setTimeout(() => {
    this.datasource.push(this.apiLinkForm.value);
    this.hideSaveActionButton = true;
    this.showDialog = false;
    this.spinner.hide();
    }, 1000);
  }

  paramsToolBarPreparing(e) {
    e.toolbarOptions.items.unshift(

      {
        location: 'before',
        widget: 'dxButton',
        options: {
          text: 'Add Link',
          type: 'default',
          icon: 'fa fa-plus',
          onClick: this.onSaveListener.bind(this)
        }
      }
    );
  }


}
