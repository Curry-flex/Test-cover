import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-correct-request',
  templateUrl: './correct-request.component.html',
  styleUrls: ['./correct-request.component.scss']
})
export class CorrectRequestComponent extends SharedClassComponent implements OnInit {
  requestForm: FormGroup
  title="request-correct"
  

  ngOnInit() {
    this.appInfo.setTitle(this.title);
    this.requestForm =  new FormGroup({
      controlNo: new FormControl('',Validators.compose([Validators.required])),
      amount: new FormControl('',Validators.compose([Validators.required]))
    })
  }


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



}
