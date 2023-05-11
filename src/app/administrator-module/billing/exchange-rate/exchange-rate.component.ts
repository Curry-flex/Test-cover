import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { confirm } from 'devextreme/ui/dialog';

import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.scss']
})
export class ExchangeRateComponent extends SharedClassComponent implements OnInit {
  showDialog = false;
  popUpTitle = 'Edit Currency Exchange Rate';
  hideSaveActionButton = true;
  currencyForm: FormGroup;
  title = 'Currency Exchange Rate';
  now = new Date();

  datasource = [
    {
      id: 1,
      currency: 'TANZANIAN SHILLINGS',
      currencyCode: 'TZS',
      rateAmount: 1,
      rateDate: '11/4/2020',
      status: 1,
    },
    {
      id: 2,
      currency: 'UNITED STATES OF AMERICA DOLLAR',
      currencyCode: 'USD',
      rateAmount: 2317.34,
      rateDate: '11/4/2020',
      status: 1,
    }
  ];

  ngOnInit() {
    this.currencyForm = new FormGroup({
      id: new FormControl(null, Validators.compose([])),
      currency: new FormControl(null, Validators.compose([Validators.required])),
      currencyCode:  new FormControl(null, Validators.compose([Validators.required])),
      rateAmount:  new FormControl(null, Validators.compose([Validators.required])),
      rateDate: new FormControl(null, Validators.compose([Validators.required])),
      status: new FormControl(null, Validators.compose([Validators.required]))
    });
    this.appInfo.setTitle(this.title);
    this.observerCall();
  }

  onEditListener(e) {
    this.popUpTitle = 'Edit Currency Exchange Rate';
    this.hideSaveActionButton = true;
    this.showDialog = true;
    this.currencyForm.patchValue(e);
    this.currencyForm.get('rateDate').patchValue(e.rateDate);
  }
  onSaveListener(e) {
    this.currencyForm.reset();
    this.popUpTitle = 'Register new Currency Exchange Rate';
    this.hideSaveActionButton = false;
    this.showDialog = true;
  }
  onActivateListener(e) {
    const result = confirm(
      'Are you sure you want to activate selected Currency Exchange Rate ?',
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
      'Are you sure you want to De-activate selected Currency Exchange Rate ?',
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
      'Are you sure you want to delete selected Currency Exchange Rate ?',
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
    if (this.currencyForm.invalid) {
      this.toastr.error('Empty inputs are not allowed');
      return;
    }
    this.spinner.show();
    setTimeout(() => {
      for (let index = 0; index < this.datasource.length; index++) {
        if (this.datasource[index].id === this.currencyForm.get('id').value) {
          this.datasource[index] = this.currencyForm.value;
          this.showDialog = false;
          this.spinner.hide();
          break;
        }
      }
    }, 1000);

  }

  onSubmitRegistrationData() {
    const id = this.datasource.length + 1;
    this.currencyForm.get('id').patchValue(id);
    this.currencyForm.get('status').patchValue(0);
    if (this.currencyForm.invalid) {
      this.toastr.error('Empty inputs are not allowed');
      return;
    }
    this.spinner.show();
    setTimeout(() => {
    this.datasource.push(this.currencyForm.value);
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
          text: 'Add Rate',
          type: 'default',
          icon: 'fa fa-plus',
          onClick: this.onSaveListener.bind(this)
        }
      }
    );
  }

}
