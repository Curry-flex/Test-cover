import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from '../shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-penalty-exemption-reason',
  templateUrl: './penalty-exemption-reason.component.html',
  styleUrls: ['./penalty-exemption-reason.component.scss']
})
export class PenaltyExemptionReasonComponent extends SharedClassComponent implements OnInit {

  penaltyExemptionDatasource = [];
  CreatePenaltyExemptionReasonForm: FormGroup;
  hideUpdateButton = true;
  showPopUpDialog = false;
  title = 'Penalty Exemption Reason';

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.appInfo.setTitle(this.title);
    this.observerCall();
    this.CreatePenaltyExemptionReasonForm = new FormGroup({
      requestType: new FormControl('PENALTY_EXEMPT_REASON_CREATE'),
      reasonId: new FormControl(),
      reason: new FormControl(null, Validators.compose([Validators.required])),
      active: new FormControl(),
    });
    this.penaltyExemptionList();
  }

  penaltyExemptionList() {
    const data = {
      requestType: 'PENALTY_EXEMPT_REASON_LIST',
      active: '',
      delete: ''
    };
    
    this.spinner.show();
    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
      if(res.code == 2000) {
        this.penaltyExemptionDatasource = res.data;
      } else {
        this.toastr.error(res.message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error('Something went wrong while processing the request', 'Request Failed');
      console.log(err);
    });
  }

  createReason() {
    if(this.CreatePenaltyExemptionReasonForm.get('reason').invalid) {
      this.toastr.error('Please enter exemption reason');
      return;
    }
    this.CreatePenaltyExemptionReasonForm.get('requestType').patchValue('PENALTY_EXEMPT_REASON_CREATE');
    this.unifiedCall(this.CreatePenaltyExemptionReasonForm.value);
  }

  rowClickedOnUpdate(item) {
    this.CreatePenaltyExemptionReasonForm.get('reason').patchValue(item.reason);
    this.CreatePenaltyExemptionReasonForm.get('reasonId').patchValue(item.id);
    this.hideUpdateButton = false;
    this.showPopUpDialog = true;
  }

  onCreateButton() {
    this.CreatePenaltyExemptionReasonForm.reset();
    this.hideUpdateButton = true;
    this.showPopUpDialog = true;
  }

  updateReason() {
    if(this.CreatePenaltyExemptionReasonForm.get('reason').invalid) {
      this.toastr.error('Please enter exemption reason');
      return;
    }
    this.CreatePenaltyExemptionReasonForm.get('requestType').patchValue('PENALTY_EXEMPT_REASON_UPDATE');
    this.CreatePenaltyExemptionReasonForm.get('reasonId').patchValue('PENALTY_EXEMPT_REASON_UPDATE');
    this.unifiedCall(this.CreatePenaltyExemptionReasonForm.value);
  }

  enableDisableDelete(status?, id?) {
    if (status == 1 || status == 0) {
      this.CreatePenaltyExemptionReasonForm.get('active').patchValue(status);
      this.CreatePenaltyExemptionReasonForm.get('requestType').patchValue('PENALTY_EXEMPT_REASON_ENABLE');
    } else {
      this.CreatePenaltyExemptionReasonForm.get('requestType').patchValue('PENALTY_EXEMPT_REASON_DELETE');
    }
    this.CreatePenaltyExemptionReasonForm.get('reasonId').patchValue(id);
    this.unifiedCall(this.CreatePenaltyExemptionReasonForm.value);
  }

  unifiedCall(data) {
    this.spinner.show();
    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
      if(res.code == 2000) {
        this.toastr.success(res.message);
        this.CreatePenaltyExemptionReasonForm.reset();
        this.penaltyExemptionList();
      } else {
        this.toastr.error(res.message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error('Something went wrong while processing the request', 'Request Failed');
      console.log(err);
    });
  }


  onParamsToolBarPreparing(e) {
    if (this.checkUserAccessRight(['DELETE', 'EDIT'])) {
      e.toolbarOptions.items.unshift( {
        location: 'before',
        widget: 'dxButton',
        options: {
          text: `Create ${this.title}`,
          type: 'default',
          icon: 'fa fa-plus',
          onClick: this.onCreateButton.bind(this)
        }
      }, {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          type: 'default',
         onClick: this.penaltyExemptionList.bind(this)
        }
      });
    } else {
      e.toolbarOptions.items.unshift({
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          type: 'default',
         onClick: this.penaltyExemptionList.bind(this)
        }
      });
    }


  }

}
