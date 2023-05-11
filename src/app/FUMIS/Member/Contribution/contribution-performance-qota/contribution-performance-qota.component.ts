import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-contribution-performance-qota',
  templateUrl: './contribution-performance-qota.component.html',
  styleUrls: ['./contribution-performance-qota.component.scss']
})
export class ContributionPerformanceQotaComponent extends SharedClassComponent implements OnInit {
  cCollectionForm: FormGroup;
  contributionList = []
  qotaList = [{name:"1"},{name:"2"},{name:"3"},{name:"4"}];
  year: any;

  

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
      "requestType": "CONTRIBUTION_COLLECTION_PERFOMANCE_QUARTERLY",
      "quarter": this.cCollectionForm.get("qota").value,
      "fiscalYear": this.cCollectionForm.get("fiscalyear").value
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        this.spinner.hide()
        if (response.code == 2000) {
          this.contributionList = response.data;
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

  getQuarter() {
    const data = {
      requestType: "BRANCHES",
      
      
    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.qotaList = response.data;
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

  getFiscalYear(e){
    
    const fyStartYear = +e.value ;
    const fyEndYear = fyStartYear + 1;
    
    this.year = `${fyStartYear}/${fyEndYear}`
    //return `${fyStartYear}/${fyEndYear}`;
  }

}
