import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-vomis-push',
  templateUrl: './vomis-push.component.html',
  styleUrls: ['./vomis-push.component.scss']
})
export class VomisPushComponent extends SharedClassComponent implements OnInit {

  title = 'Vomis - Push';
  pqIdForm: FormGroup;
  endpoint = "backend/request"

  ngOnInit() {
    this.currentRoute = `${this.router.url}`.replace('/', '');
    this.appInfo.setTitle(this.title);
    this.pqIdForm = new FormGroup({
      pq_id: new FormControl(null, Validators.compose([Validators.required]))
    });

    this.paramwinfrm = new FormGroup({
      response_id: new FormControl(null, Validators.compose([])),
      request_id:  new FormControl(null, Validators.compose([])),
      membership_number:  new FormControl(null, Validators.compose([])),
      membership_type: new FormControl(null, Validators.compose([])),
      membership_name:  new FormControl(null, Validators.compose([])),
      amount:  new FormControl(null, Validators.compose([])),
      currency: new FormControl(null, Validators.compose([])),
      payment_mode:  new FormControl(null, Validators.compose([])),
      receipt_no:  new FormControl(null, Validators.compose([])),
      psp_ref_no: new FormControl(null, Validators.compose([])),
      description:  new FormControl(null, Validators.compose([])),
      subsidium_01:  new FormControl(null, Validators.compose([])),
      subsidium_02: new FormControl(null, Validators.compose([])),
      subsidium_03:  new FormControl(null, Validators.compose([])),
      subsidium_04:  new FormControl(null, Validators.compose([])),
      subsidium_05:  new FormControl(null, Validators.compose([]))
    });
    this.observerCall();
  }

  onVomisPushHandler() {

    if (this.pqIdForm.invalid) {
      this.toastr.error("pq id is required...!");
      return;
    }
    this.spinner.show();
    const data = {
      requestType:"VOMIS_PUSH",
		  pq_id : this.pqIdForm.get('pq_id').value
    }

    this.utilities.postServiceCall(data, this.endpoint).subscribe(res => {

      const serveResponse = res;
      if (serveResponse.code == 2000) {
        this.toastr.success(serveResponse.message);
        this.paramwinfrm.patchValue(serveResponse.data)
      } else {
        this.toastr.error(serveResponse.message);
        this.paramwinfrm.patchValue(null);
      }
      this.spinner.hide();
    }, err => {
      this.toastr.error("Something went wrong, while processing the request. Error Message: " + err.message)
      this.spinner.hide();
    });
  }

}
