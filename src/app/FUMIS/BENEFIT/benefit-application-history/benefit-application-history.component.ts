import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-benefit-application-history',
  templateUrl: './benefit-application-history.component.html',
  styleUrls: ['./benefit-application-history.component.scss']
})
export class BenefitApplicationHistoryComponent extends SharedClassComponent implements OnInit {
  historyForm: FormGroup;

  historyDatasource: any;

 

  ngOnInit() {
    this.historyForm = new FormGroup({
     
      appNo: new FormControl('', Validators.compose([Validators.required])),
     
    
    });
  }

  
  getHistory()
  {
    if(this.historyForm.invalid)
    {
      this.toastr.error("Enter application number to proceed")
      return
    }

    const data = {
    
      "requestType": "BENEFIT_APPLICATION_HISTORY",
      "applicationNo": this.historyForm.get("appNo").value,


    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.historyDatasource = response.data;
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

}
