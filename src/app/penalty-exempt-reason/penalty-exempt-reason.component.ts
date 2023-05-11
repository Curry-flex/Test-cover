import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from '../shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-penalty-exempt-reason',
  templateUrl: './penalty-exempt-reason.component.html',
  styleUrls: ['./penalty-exempt-reason.component.scss']
})
export class PenaltyExemptReasonComponent extends SharedClassComponent implements OnInit {

 responseData =[]
 pendindExeption=true
 showApprovalData=false

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
    this.penaltyExemptForm = new FormGroup({
      requestType: new FormControl('PENALTY_EXEMPT'),
      penNo: new FormControl(),
      exmStatus: new FormControl(null, Validators.required),
      resonId: new FormControl(null, Validators.required)
    });
    this.getPenaltyExemptReason()
  }


  getPenaltyExemptReason() {
    const data = {
      requestType: "PENALTY_PENDING_EXEMPTION_LIST",
      
      
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        //console.log(res)
        if (response.code == 2000) {
          this.responseData = response.data;
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

  getPenaltyPreviewDetails(e) {
   
    const data = {
      requestType: 'PENALTY_GET',
      penNo: e.data.penNo
    }
    this.utilities.baseApiPostServiceCall(data).subscribe(res => {
      if(res.code == 2000) {
        //console.log(res)
        this.singleViewPenaltyData = res.data;
        this.showApprovalData=true
        this.pendindExeption=false
      } else {
        this.toastr.error(res.message);
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error('Something went wrong while processing the request', 'Request Failed');
     // console.log(err);
    });
  }

  backButton()
  {
    this.showApprovalData=false
    this.pendindExeption=true
    this.getPenaltyExemptReason()
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
