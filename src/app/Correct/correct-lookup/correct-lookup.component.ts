import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-correct-lookup',
  templateUrl: './correct-lookup.component.html',
  styleUrls: ['./correct-lookup.component.scss']
})
export class CorrectLookupComponent extends SharedClassComponent implements OnInit {
  lookupForm: FormGroup;

  title="Correct Lookup"
  lookupResult=[]
  lookupDetails=false
  requestLookup=false
  showCorrectList=false
  showTabs = true
  controlNo:any
  newAmount:any
  billAmount:any
  invAmount:any
  invDetAmount:any
  iciTotAmount:any
  requestForm: FormGroup;
  approvalForm:FormGroup
  showLookup = true

  approveParamswinpnl=false


  tab_paneldata: any = [{
    ID: 1,
    icon: '',
    name: 'Pending',
}, {
    ID: 2,
    icon: '',
    name: 'Approved',
}
];

datasource=[{name:"APPROVE "},{name:"DECLINE"}]

pendingListDatasource=[]
approvedListDatasource=[]

  ngOnInit() {
    
    this.appInfo.setTitle(this.title);
    this.lookupForm =  new FormGroup({
      controlNo: new FormControl('',Validators.compose([Validators.required])),
      amount: new FormControl('',Validators.compose([]))
    })

    this.requestForm =  new FormGroup({
      controlNo: new FormControl('',Validators.compose([Validators.required])),
      amount: new FormControl('',Validators.compose([Validators.required]))
    })
    this.approvalForm =  new FormGroup({
      action: new FormControl('',Validators.compose([Validators.required])),
    
    })

    this.pendingList()
    this.ApprovedList()
  }


  lookup() {

    if (this.lookupForm.get("controlNo").invalid) {
      this.toastr.error("fill all required data to continue...");
      return;
    }
    

    this.spinner.show();
    const data = {
      requestType:"BILL_AMOUNT_CORRECT_LOOKUP",
		  billRef : this.lookupForm.get('controlNo').value,
      amount : this.lookupForm.get('amount').value
    }

    this.utilities.postServiceCall(data, '').subscribe(res => {
      //console.log(res)
      const serveResponse = res;
      if (serveResponse.code == 2000) {
        this.toastr.success(serveResponse.message);
        this.controlNo = serveResponse.data.controlNo
        this.newAmount = serveResponse.data.newAmount
        this.billAmount = serveResponse.data.billAmount
        this.invAmount = serveResponse.data.invAmount
        this.invDetAmount = serveResponse.data.invDetAmount
        this.iciTotAmount = serveResponse.data.iciTotAmount
        this.requestForm.get("controlNo").patchValue(this.controlNo)
        this.requestForm.get("amount").patchValue(this.newAmount)
        this.showTabs =false
        this.showLookup = false
        this.lookupDetails=true
        this.requestLookup=true
        console.log(serveResponse.data)
      } else {
        this.toastr.error(serveResponse.message);
        
      }
      this.spinner.hide();
    }, err => {
      this.toastr.error("Something went wrong, while processing the request. Error Message: " + err.message)
      this.spinner.hide();
    });
  }


  //correct request
  correctRequest() {

    if (this.requestForm.invalid) {
      this.toastr.error("fill all required data to continue...");
      return;
    }
    this.spinner.show();
    const data = {
      requestType:"BILL_AMOUNT_CORRECT_REQUEST",
		  billRef : this.requestForm.get('controlNo').value,
      amount : this.requestForm.get('amount').value
    }

    this.utilities.postServiceCall(data, '').subscribe(res => {

      const serveResponse = res;
      if (serveResponse.code == 2000) {
        this.toastr.success(serveResponse.message);
        this.requestForm.reset()
        this.requestLookup =false
        this.lookupDetails =false
        this.showLookup = true
        this.showTabs = true

        this.pendingList()
        this.ApprovedList()
        //this.showCorrectList=true
        
      } else {
        this.toastr.error(serveResponse.message);
        
      }
      this.spinner.hide();
    }, err => {
      this.toastr.error("Something went wrong, while processing the request. Error Message: " + err.message)
      this.spinner.hide();
    });
  }

  //PENDING APPROVED LIST METHOD
  pendingList() {

   
    this.spinner.show();
    const data = {
      requestType:"BILL_AMOUNT_CORRECT_LIST",
		  scope : "PENDING",
 
    }

    this.utilities.postServiceCall(data, '').subscribe(res => {

      const serveResponse = res;
      if (serveResponse.code == 2000) {
        //this.toastr.success(serveResponse.message);
        this.pendingListDatasource= serveResponse.data
       
      } else {
        this.toastr.error(serveResponse.message);
        
      }
      this.spinner.hide();
    }, err => {
      this.toastr.error("Something went wrong, while processing the request. Error Message: " + err.message)
      this.spinner.hide();
    });
  }

  ApprovedList() {

   
    this.spinner.show();
    const data = {
      requestType:"BILL_AMOUNT_CORRECT_LIST",
		  scope : "APPROVED",
 
    }

    this.utilities.postServiceCall(data, '').subscribe(res => {

      const serveResponse = res;
      if (serveResponse.code == 2000) {
        this.approvedListDatasource= serveResponse.data
      } else {
        this.toastr.error(serveResponse.message);
        
      }
      this.spinner.hide();
    }, err => {
      this.toastr.error("Something went wrong, while processing the request. Error Message: " + err.message)
      this.spinner.hide();
    });
  }


  approve(e)
  {

    sessionStorage.removeItem("approvalRequestID")
    sessionStorage.setItem("approvalRequestID",e.id)
    this.approveParamswinpnl=true

  }


  approveRequest()
  {

    if (this.approvalForm.invalid) {
      this.toastr.error("fill all required data to continue...");
      return;
    }
    this.spinner.show();
    const data = {
      requestType:"BILL_AMOUNT_CORRECT_APPROVE",
		  id : sessionStorage.getItem("approvalRequestID"),
      action : this.approvalForm.get('action').value
    }

    this.utilities.postServiceCall(data, '').subscribe(res => {

      const serveResponse = res;
      if (serveResponse.code == 2000) {

        this.approveParamswinpnl =false
        this.toastr.success(serveResponse.message);
        this.pendingList()
        
        
      } else {
        this.toastr.error(serveResponse.message);
        
      }
      this.spinner.hide();
    }, err => {
      this.toastr.error("Something went wrong, while processing the request. Error Message: " + err.message)
      this.spinner.hide();
    });

  }

  onToolBarPreparing(e) {
    e.toolbarOptions.items.unshift( {
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'refresh',
        type: 'default',
        onClick: this.pendingList.bind(this)
      }
    });
  }


  
  onToolBarPreparingApproved(e) {
    e.toolbarOptions.items.unshift( {
      location: 'after',
      widget: 'dxButton',
      options: {
        icon: 'refresh',
        type: 'default',
        onClick: this.ApprovedList.bind(this)
      }
    });
  }

  


}
