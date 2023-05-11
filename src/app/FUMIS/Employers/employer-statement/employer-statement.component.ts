import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedClassComponent } from 'src/app/shared/components/shared-class/shared-class.component';

@Component({
  selector: 'app-employer-statement',
  templateUrl: './employer-statement.component.html',
  styleUrls: ['./employer-statement.component.scss']
})
export class EmployerStatementComponent extends SharedClassComponent implements OnInit {

  years =[]
  statementForm: FormGroup;
  statementDatasource: any = [];
  // constructor() { }

  ngOnInit() {
   this.years = this.getYears()

   this.statementForm = new FormGroup({
     
    empNo: new FormControl('', Validators.compose([Validators.required])),
    year: new FormControl('', Validators.compose([Validators.required])),
  
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


  filterStetement()
  {
    if(this.statementForm.invalid)
    {
      this.toastr.error("Enter employer number and year to proceed")
      return
    }

    const data = {
    
        "requestType": "EMPLOYER_STATEMENT",
        "employerNumber": this.statementForm.get("empNo").value,
        "year": this.statementForm.get("year").value

    };
    this.spinner.show();
    this.utilities.postServiceCallNew(data).subscribe(
      (res) => {
        const response = res;
        if (response.code == 2000) {
          this.statementDatasource = response.data;
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
