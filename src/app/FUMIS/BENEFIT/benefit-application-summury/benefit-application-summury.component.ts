import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-benefit-application-summury',
  templateUrl: './benefit-application-summury.component.html',
  styleUrls: ['./benefit-application-summury.component.scss']
})
export class BenefitApplicationSummuryComponent extends SharedClassComponent implements OnInit {

  month = [
    {name:"January",value:"1"},
    {name:"February",value:"2"},
    {name:"March",value:"3"},
    {name:"April",value:"4"},
    {name:"May",value:"5"},
    {name:"June",value:"6"},
    {name:"July",value:"7"},
    {name:"August",value:"8"},
    {name:"September",value:"9"},
    {name:"October",value:"10"},
    {name:"November",value:"11"},
    {name:"December",value:"12"},
  ]
  years: any[];
  summaryForm: FormGroup;
  summaryDataSource: any = []



  ngOnInit() {
    this.years = this.getYears()


    this.summaryForm = new FormGroup({

      startDate: new FormControl(this.today, Validators.compose([])),
      endDate: new FormControl(this.today, Validators.compose([])),
      district: new FormControl('', Validators.compose([])),
      sector: new FormControl('', Validators.compose([])),
      employerNumber: new FormControl('', Validators.compose([])),
      month: new FormControl('', Validators.compose([])),
      year: new FormControl('', Validators.compose([])),
      max: new FormControl('', Validators.compose([])),
      min: new FormControl('', Validators.compose([])),
      applicationType: new FormControl('', Validators.compose([])),
     
    });
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

  getSummary()
  {

    const startDatestring = new Date(this.summaryForm.get('startDate').value).getFullYear() + "-"+  ("0"+(new Date(this.summaryForm.get('startDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.summaryForm.get('startDate').value).getDate()).slice(-2);
    const endDatestring =  new Date(this.summaryForm.get('endDate').value).getFullYear() + "-"+  ("0"+(new Date(this.summaryForm.get('endDate').value).getMonth()+1)).slice(-2) + "-" +("0" + new Date(this.summaryForm.get('endDate').value).getDate()).slice(-2);


    const data = {
      "requestType": "BENEFITS_APPLICATION_SUMMARY",
      "month": this.summaryForm.get('month').value,
      "year": this.summaryForm.get("year").value,
      "startDate": startDatestring,
      "endDate": endDatestring,
      "max": this.summaryForm.get('max').value,
      "min": this.summaryForm.get('min').value,
      "sectorID": this.summaryForm.get('sector').value,
      "employerNumber": this.summaryForm.get('employerNumber').value,
      "districtID": this.summaryForm.get('district').value,
      "applicationTypeID": this.summaryForm.get('applicationType').value

    };

    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
           this.summaryDataSource = response.data;
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
