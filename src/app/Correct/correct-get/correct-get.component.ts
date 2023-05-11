import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-correct-get',
  templateUrl: './correct-get.component.html',
  styleUrls: ['./correct-get.component.scss']
})
export class CorrectGetComponent extends SharedClassComponent implements OnInit {

  title="bill-get"
  queryForm: FormGroup;
  controlNo:any
  newAmount:any
  billAmount:any
  invAmount:any
  invDtAmount:any
  iciAmount:any
  createdAt:any
  createdBy:any
  status:any
  id:any

  correctDetails=false
  

  ngOnInit() {

    this.appInfo.setTitle(this.title);
    this.queryForm =  new FormGroup({
      ID: new FormControl('',Validators.compose([Validators.required]))
    })
  }


  query()
  {

    if (this.queryForm.invalid) {
      this.toastr.error("fill all required data to continue...");
      return;
    }
    this.spinner.show();
    const data = {
      requestType:"BILL_AMOUNT_CORRECT_GET",
		  id : this.queryForm.get('ID').value
    }

    this.utilities.postServiceCall(data, '').subscribe(res => {

      const serveResponse = res;
      if (serveResponse.code == 2000) {
        this.toastr.success(serveResponse.message);
        this.controlNo = serveResponse.data.controlNo
        this.newAmount = serveResponse.data.newAmount
        this.billAmount = serveResponse.data.billAmount
        this.invAmount = serveResponse.data.invAmount
        this.invDtAmount = serveResponse.data.invDtAmount
        this.iciAmount = serveResponse.data.iciAmount
        this.createdAt = serveResponse.data.createdAt
        this.createdBy = serveResponse.data.createdBy
        this.status = serveResponse.data.status
        this.id = serveResponse.data.id
        this.correctDetails=true
     
      } else {
        this.toastr.error(serveResponse.message);
        
      }
      this.spinner.hide();
    }, err => {
      this.toastr.error("Something went wrong, while processing the request. Error Message: " + err.message)
      this.spinner.hide();
    });

  }
 
}
