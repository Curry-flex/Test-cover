import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from '../shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-penalty-exemption',
  templateUrl: './penalty-exemption.component.html',
  styleUrls: ['./penalty-exemption.component.scss']
})
export class PenaltyExemptionComponent extends SharedClassComponent implements OnInit {

  title = 'Penalty List';
  penaltyExemptionDatasource = [];
  penaltyExemptionReasonDatasource = [];

  searchPenaltyExemptionForm: FormGroup;
  penaltyExemptForm: FormGroup;

  hideSingleViewPenaltyData = true;

  singleViewPenaltyData = {
    penNo: null,
    penInvNo: null,
    penInvCtrlNo: null,
    penInvDesc: null,
    ogInvNo: null,
    ogCtrlNo: null,
    ogInvDesc: null,
    empNo: null,
    empName: null,
    penAmount: null,
    ogAmount: null,
    totalAmount: null,
    paidAmount: null,
    paymentStatus: null,
    penDesc: null,
    penPercent: null,
    exmStatus: null,
    exmReason: null,
    createdBy: null,
    createdAt: null,
    modifiedBy: null,
    modifiedAt: null
  };

  penaltyPaymentStatusDatasource = [
    {
      id: 'PENDING EXEMPTION',
      value: 'PENDING EXEMPTION'
    },
    {
      id: 'EXEMPTED',
      value: 'EXEMPTED'
    },
    {
      id: 'FULL PAID',
      value: 'FULL PAID'
    },
    {
      id: 'PARTIAL PAID',
      value: 'PARTIAL PAID'
    },
    {
      id: 'NOT PAID',
      value: 'NOT PAID'
    },
    {
      id: 'ALL',
      value: 'ALL'
    },
  ];

  approvalDatasource = [
    {
      id: 1,
      value: 'Approve'
    },
    {
      id: 2,
      value: 'Decline'
    }
  ];

  ngOnInit() {
    this.appInfo.setTitle(this.title);
    this.observerCall();
    this.searchPenaltyExemptionForm = new FormGroup({
      requestType: new FormControl('FUMIS_PENALTIES_LIST'),
      date: new FormControl(),
      employerNo: new FormControl(),
      controlNo: new FormControl(),
      penaltyNo: new FormControl(),
      invoiceNo: new FormControl(),
      payStatus: new FormControl(),
      penNo: new FormControl()
    });

    this.penaltyExemptForm = new FormGroup({
      requestType: new FormControl('PENALTY_EXEMPT'),
      penNo: new FormControl(),
      exmStatus: new FormControl(null, Validators.required),
      resonId: new FormControl(null, Validators.required)
    });
    this.penaltyExemptionReasonList();
  }

  penaltyExemptionReasonList() {
    const data = {
      requestType: 'PENALTY_EXEMPT_REASON_LIST',
      active: '',
      delete: ''
    };
    this.spinner.show();
    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
      if(res.code == 2000) {
        this.penaltyExemptionReasonDatasource = res.data;
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

  // 14.0 FUMIS PENALTIES LIST
  penaltyExemptionList() {
    if (this.searchPenaltyExemptionForm.get('date').value !== null &&
    `${this.searchPenaltyExemptionForm.get('date').value}`.replace(/\s/g,'') != '') {
      if (!this.isValidDate(this.searchPenaltyExemptionForm.get('date').value)) {
        this.toastr.error('The date format was invalid, please consider to use valid date format(yyyy-MM-dd)');
        this.spinner.hide();
        return;
      }
    }
    this.searchPenaltyExemptionForm.get('requestType').patchValue('FUMIS_PENALTIES_LIST');
    this.spinner.show();
    this.utilities.baseApiPostServiceCall(this.searchPenaltyExemptionForm.value).subscribe(res => {
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

  getPenaltyDetails(penNo) {
    const data = {
      requestType: 'PENALTY_GET',
      penNo
    }
    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
      if(res.code == 2000) {
        this.singleViewPenaltyData = res.data;
        this.hideSingleViewPenaltyData = false;
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

  getPenaltyPreviewDetails(e) {
    const data = {
      requestType: 'PENALTY_GET',
      penNo: e.data.penNo
    }
    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
      if(res.code == 2000) {
        this.singleViewPenaltyData = res.data;
        this.hideSingleViewPenaltyData = false;
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

  backButton() {
    this.searchPenaltyExemptionForm.reset();
    this.hideSingleViewPenaltyData = true;
    this.singleViewPenaltyData = {
      penNo: null,
      penInvNo: null,
      penInvCtrlNo: null,
      penInvDesc: null,
      ogInvNo: null,
      ogCtrlNo: null,
      ogInvDesc: null,
      empNo: null,
      empName: null,
      penAmount: null,
      ogAmount: null,
      totalAmount: null,
      paidAmount: null,
      paymentStatus: null,
      penDesc: null,
      penPercent: null,
      exmStatus: null,
      exmReason: null,
      createdBy: null,
      createdAt: null,
      modifiedBy: null,
      modifiedAt: null
    };
  }

  penaltyExempt(penNo) {
    if (this.penaltyExemptForm.get('resonId').invalid) {
      this.toastr.error('Please select penalty exemption reason!!');
      return;
    }
    this.penaltyExemptForm.get('requestType').patchValue('PENALTY_EXEMPT');
    this.penaltyExemptForm.get('penNo').patchValue(penNo);
    this.utilities.baseApiPostServiceCall(this.penaltyExemptForm.value).subscribe(res => {
      if(res.code == 2000) {
        this.toastr.success(res.message);
        this.backButton();
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

  penaltyExemptApproval(penNo) {
    if (this.penaltyExemptForm.get('exmStatus').invalid) {
      this.toastr.error('Please select penalty exemption approval action!!');
      return;
    }
    this.penaltyExemptForm.get('requestType').patchValue('PENALTY_EXEMPT_APPROVE');
    this.penaltyExemptForm.get('penNo').patchValue(penNo);
    this.utilities.baseApiPostServiceCall(this.penaltyExemptForm.value).subscribe(res => {
      if(res.code == 2000) {
        this.toastr.success(res.message);
        this.backButton();
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


}
