import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';
import { confirm } from 'devextreme/ui/dialog';

@Component({
  selector: 'app-communication-channels',
  templateUrl: './communication-channels.component.html',
  styleUrls: ['./communication-channels.component.scss']
})
export class CommunicationChannelsComponent extends SharedClassComponent  implements OnInit {

  showDialog = false;
  popUpTitle = 'Edit Payment Communication Channel';
  hideSaveActionButton = true;
  channelForm: FormGroup;
  title = 'Payment Communication Channels';

  datasource = [
    {
      id: 1,
      channelId: 'CH001',
      channelName: 'BANK',
      status: 1
    },
    {
      id: 2,
      channelId: 'CH002',
      channelName: 'POS',
      status: 1
    },
    {
      id: 3,
      channelId: 'CH003',
      channelName: 'USSD',
      status: 1
    },
    {
      id: 4,
      channelId: 'CH004',
      channelName: 'MOBILE APP',
      status: 1
    },
    {
      id: 5,
      channelId: 'CH005',
      channelName: 'INTERNET BANKING',
      status: 1
    }
  ];

  ngOnInit() {
    this.channelForm = new FormGroup({
      id: new FormControl(null, Validators.compose([])),
      channelId: new FormControl(null, Validators.compose([Validators.required])),
      channelName:  new FormControl(null, Validators.compose([Validators.required])),
      status: new FormControl(null, Validators.compose([Validators.required]))
    });
    this.appInfo.setTitle(this.title);
    this.observerCall();
  }

  onEditListener(e) {
    this.popUpTitle = 'Edit Payment Communication Channel';
    this.hideSaveActionButton = true;
    this.showDialog = true;
    this.channelForm.patchValue(e);
  }
  onSaveListener(e) {
    this.channelForm.reset();
    this.popUpTitle = 'Register new Payment Communication Channel';
    this.hideSaveActionButton = false;
    this.showDialog = true;
  }
  onActivateListener(e) {
    const result = confirm(
      'Are you sure you want to activate selected payment Communication Channel ?',
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
      'Are you sure you want to De-activate selected payment Communication Channel ?',
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
      'Are you sure you want to delete selected payment Communication Channel ?',
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
    if (this.channelForm.invalid) {
      this.toastr.error('Empty inputs are not allowed');
      return;
    }
    this.spinner.show();
    setTimeout(() => {
      for (let index = 0; index < this.datasource.length; index++) {
        if (this.datasource[index].id === this.channelForm.get('id').value) {
          this.datasource[index] = this.channelForm.value;
          this.showDialog = false;
          this.spinner.hide();
          break;
        }
      }
    }, 1000);

  }

  onSubmitRegistrationData() {
    const id = this.datasource.length + 1;
    this.channelForm.get('id').patchValue(id);
    this.channelForm.get('status').patchValue(0);
    if (this.channelForm.invalid) {
      this.toastr.error('Empty inputs are not allowed');
      return;
    }
    this.spinner.show();
    setTimeout(() => {
    this.datasource.push(this.channelForm.value);
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
          text: 'Add Channel',
          type: 'default',
          icon: 'fa fa-plus',
          onClick: this.onSaveListener.bind(this)
        }
      }
    );
  }

}
