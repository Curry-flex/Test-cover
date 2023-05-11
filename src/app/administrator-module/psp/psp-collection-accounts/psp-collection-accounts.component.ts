import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { DxDataGridModule, DxButtonModule, DxDataGridComponent } from 'devextreme-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { confirm } from 'devextreme/ui/dialog';
// import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';

@Component({
  selector: 'app-psp-collection-accounts',
  templateUrl: './psp-collection-accounts.component.html',
  styleUrls: ['./psp-collection-accounts.component.scss']
})
export class PspCollectionAccountsComponent extends SharedClassComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  showDialog = false;
  popUpTitle = 'Edit PSP Collection Account';
  hideSaveActionButton = true;
  editPspForm: FormGroup;
  title = 'PSP Collection Accounts';
  datasource = [
    {
      id: 1,
      psp: 'CRDB',
      accName: 'ZSSF Collection Account',
      accNumber: 66748364635,
      currency: 'TZS',
      status: 1
    },
    {
      id: 2,
      psp: 'NMB',
      accName: 'ZSSF Collection Account',
      accNumber: 66748364635,
      currency: 'TZS',
      status: 1
    },
    {
      id: 3,
      psp: 'NBC',
      accName: 'ZSSF Collection Account',
      accNumber: 66748364635,
      currency: 'TZS',
      status: 1
    },
    {
      id: 4,
      psp: 'PBZ',
      accName: 'ZSSF Collection Account',
      accNumber: 66748364635,
      currency: 'TZS',
      status: 1
    },
    {
      id: 5,
      psp: 'BOA',
      accName: 'ZSSF Collection Account',
      accNumber: 66748364635,
      currency: 'TZS',
      status: 1
    },
    {
      id: 6,
      psp: 'TIGO',
      accName: 'ZSSF Collection Account',
      accNumber: 66748364635,
      currency: 'TZS',
      status: 1
    },
    {
      id: 7,
      psp: 'ZANTEL',
      accName: 'ZSSF Collection Account',
      accNumber: 66748364635,
      currency: 'TZS',
      status: 1
    },
    {
      id: 8,
      psp: 'AIRTEL',
      accName: 'ZSSF Collection Account',
      accNumber: 66748364635,
      currency: 'TZS',
      status: 1
    },
    {
      id: 9,
      psp: 'VODACOM',
      accName: 'ZSSF Collection Account',
      accNumber: 66748364635,
      currency: 'TZS',
      status: 1
    },
  ];
  currencyDts = [
    {
      id: 1,
      text: 'TZS'
    },
    {
      id: 2,
      text: 'USD'
    }
  ];
  ngOnInit() {
    this.editPspForm = new FormGroup({
      id: new FormControl(null, Validators.compose([])),
      psp: new FormControl(null, Validators.compose([Validators.required])),
      accName:  new FormControl(null, Validators.compose([Validators.required])),
      accNumber:  new FormControl(null, Validators.compose([Validators.required])),
      currency:  new FormControl(null, Validators.compose([Validators.required])),
      status: new FormControl(null, Validators.compose([Validators.required]))
    });
    this.appInfo.setTitle(this.title);
    this.observerCall();
  }

  onEditListener(e) {
    this.popUpTitle = 'Edit PSP Collection Account';
    this.hideSaveActionButton = true;
    this.showDialog = true;
    this.editPspForm.patchValue(e);
    if (e.currency === 'TZS') {
      this.editPspForm.get('currency').patchValue(1);
    } else if (e.currency === 'USD') {
      this.editPspForm.get('currency').patchValue(2);
    }
  }
  onSaveListener(e) {
    this.editPspForm.reset();
    this.popUpTitle = 'Register new PSP Collection Account';
    this.hideSaveActionButton = false;
    this.showDialog = true;
  }
  onActivateListener(e) {
    const result = confirm(
      'Are you sure you want to activate selected PSP Collection Account ?',
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
      'Are you sure you want to De-activate selected PSP Collection Account ?',
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
      'Are you sure you want to delete selected PSP Collection Account ?',
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
    if (this.editPspForm.invalid) {
      this.toastr.error('Empty inputs are not allowed');
      return;
    }
    this.spinner.show();
    setTimeout(() => {
      for (let index = 0; index < this.datasource.length; index++) {
        if (this.datasource[index].id === this.editPspForm.get('id').value) {
          this.datasource[index] = this.editPspForm.value;
          this.datasource[index].currency = this.editPspForm.get('currency').value === 1 ? 'TZS' : 'USD';
          this.showDialog = false;
          this.spinner.hide();
          break;
        }
      }
    }, 1000);

  }

  onSubmitRegistrationData() {
    const id = this.datasource.length + 1;
    this.editPspForm.get('id').patchValue(id);
    this.editPspForm.get('status').patchValue(0);
    const currency = this.editPspForm.get('currency').value;
    currency === 1 ? this.editPspForm.get('currency').patchValue('TZS') : this.editPspForm.get('currency').patchValue('USD');

    if (this.editPspForm.invalid) {
      this.toastr.error('Empty inputs are not allowed');
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

 
  paramsToolBarPreparing(e) {
    e.toolbarOptions.items.unshift(

      {
        location: 'before',
        widget: 'dxButton',
        options: {
          text: 'Add',
          type: 'default',
          icon: 'fa fa-plus',
          onClick: this.onSaveListener.bind(this)
        }
      }
    );
  }

//   exportGrid() {
//     const doc = new jsPDF();
//     exportDataGridToPdf({
//         jsPDFDocument: doc,
//         component: this.dataGrid.instance
//     }).then(() => {
//         doc.save('Psp-Collection-accounts.pdf');
//     });
// }
}
