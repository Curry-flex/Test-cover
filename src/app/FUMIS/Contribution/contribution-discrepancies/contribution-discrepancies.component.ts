import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-contribution-discrepancies',
  templateUrl: './contribution-discrepancies.component.html',
  styleUrls: ['./contribution-discrepancies.component.scss']
})
export class ContributionDISCREPANCIESComponent extends SharedClassComponent implements OnInit {

  month = [
    {name:"January",value:"01"},
    {name:"February",value:"02"},
    {name:"March",value:"03"},
    {name:"April",value:"04"},
    {name:"May",value:"05"},
    {name:"June",value:"06"},
    {name:"July",value:"07"},
    {name:"August",value:"08"},
    {name:"September",value:"09"},
    {name:"October",value:"10"},
    {name:"November",value:"11"},
    {name:"December",value:"12"},
  ]
  contributionForm: FormGroup;;
  years =[]
  contributionDatasource =[]


  ngOnInit() {

    this.years = this.getYears()

    this.contributionForm = new FormGroup({
     
      empNo: new FormControl('', Validators.compose([Validators.required])),
      month: new FormControl('', Validators.compose([Validators.required])),
      year: new FormControl('', Validators.compose([Validators.required])),
    
    });
    this.getYears()
  }

  public getYears() {
    const years = [];
    const initialYear = 2017;
    const date = new Date();
    const currentYear = date.getFullYear();
    for (let i = currentYear; i >= initialYear; i--) {
      years.push(i);
    }
    return years;
  }


  getContributionsDesc()
  {
    if(this.contributionForm.invalid)
    {
      this.toastr.error("Input all required fields")
      return
    }


    const data = {
    
      "requestType": "CONTRIBUTION_DISCREPANCIES",
      "employerNumber": this.contributionForm.get("empNo").value,
      "contributionMonth": this.contributionForm.get("month").value,
      "contributionYear": this.contributionForm.get("year").value


  };
  this.spinner.show();
  this.utilities.postServiceCallNew(data).subscribe(
    (res) => {
      const response = res;
      if (response.code == 2000) {
        this.contributionDatasource = response.data;
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
