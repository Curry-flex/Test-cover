import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-contribution-performance-month',
  templateUrl: './contribution-performance-month.component.html',
  styleUrls: ['./contribution-performance-month.component.scss']
})
export class ContributionPerformanceMonthComponent extends SharedClassComponent implements OnInit {

  cCollectionForm: FormGroup;
  contributionList = []
  qotaList = [{name:"1"},{name:"2"},{name:"3"},{name:"4"}]

  

  ngOnInit() {

    this.cCollectionForm = new FormGroup({
      qota: new FormControl('', Validators.compose([Validators.required])),
      fiscalyear: new FormControl('', Validators.compose([Validators.required])),
    
    });
  }


  filterContribution()
  {

    if(this.cCollectionForm.invalid)
    {
      this.toastr.error("Input all required fileds")
       return;
    }

    const data = {
      "requestType": "CONTRIBUTION_COLLECTION_PERFOMANCE_MONTHLY",
      "quarter": this.cCollectionForm.get("qota").value,
      "fiscalYear": this.cCollectionForm.get("fiscalyear").value
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        this.spinner.hide()
        const response = res;
        if (response.code == 2000) {
          this.contributionList = response.data.data;
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
