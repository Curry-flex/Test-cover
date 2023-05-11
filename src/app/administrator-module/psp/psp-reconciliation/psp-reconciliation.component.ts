import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-psp-reconciliation',
  templateUrl: './psp-reconciliation.component.html',
  styleUrls: ['./psp-reconciliation.component.scss']
})
export class PspReconciliationComponent extends SharedClassComponent implements OnInit {

  title = "PSP Reconciliation Records";
  reconciliedTransactions = [];
  reconRequest: FormGroup
  unReconciliedTransactions = [];
  tab_paneldata: any = [
    {
      ID: 1,
      icon: 'fa fa-check-circle-o',
      name: 'Reconciled Transactions',
    },
    {
      ID: 2,
      icon: 'fa fa-minus-circle',
      name: 'Unreconciled Transactions',
    }
  ];
  ngOnInit() {
    this.appInfo.setTitle(this.title);
    this.observerCall();
    this.getReconciledTxns();
    this.getUnReconciledTxns();

    this.reconRequest = new FormGroup({

      Date: new FormControl(this.today, Validators.compose([])),
    });
  }

  getReconciledTxns() {
    const data = {
      "requestType": "RECON_SUCCESS_LIST"
    };

    this.spinner.show();
    this.utilities.postServiceCall(data, this.backEndRequestEndPoint).subscribe(res => {
      console.log(res)
      const responseData = res;
        this.reconciliedTransactions = responseData.data;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error('Something went wrong while process the request.');
      console.log(err);
    });
  }

  getUnReconciledTxns() {
    const data = {
      "requestType": "RECON_FAILED_LIST"
    };

    this.spinner.show();
    this.utilities.postServiceCall(data, this.backEndRequestEndPoint).subscribe(res => {
      
      const responseData = res;
        this.unReconciliedTransactions = responseData.data;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error('Something went wrong while process the request.');
      console.log(err);
    });
  }


  onReconciliationToolBarPreparing(e, refresh_action) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          type: 'default',
          onClick: refresh_action.bind(this)
        }
      }
    );
  }

  reconciliationHandler()
  {
    if(this.reconRequest.invalid)
    {
      this.toastr.error("Invalid form details")
      return;
    }

    const requestDate = new Date(this.reconRequest.get('Date').value).getFullYear() + "-"+  ("0"+(new Date(this.reconRequest.get('Date').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.reconRequest.get('Date').value).getDate()).slice(-2);
    const data = {
      "requestType": "RECON_REQUEST",
      "reconDate":requestDate
    };

    this.spinner.show();
    this.utilities.postServiceCall(data, this.backEndRequestEndPoint).subscribe(res => {
      this.spinner.hide()
     
      const responseData = res;
      if(responseData.code == 2000)
      {
        this.toastr.success("Operation successfully")
      }
      else{
        this.toastr.success(responseData.message)
        this.spinner.hide()
      }
      
    }, err => {
      this.spinner.hide();
      this.toastr.error('Something went wrong while process the request.');
      console.log(err);
    });
  }

}
